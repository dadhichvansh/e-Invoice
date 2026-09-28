'use server';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

const REVENUE_MONTHS = 6;

export async function getDashboardData() {
  const { user } = await requireAuthentication();

  const now = new Date();

  const revenueStartDate = new Date(
    now.getFullYear(),
    now.getMonth() - (REVENUE_MONTHS - 1),
    1,
  );

  const [
    clientCount,
    invoiceCounts,
    monetaryAggregates,
    overdueAggregates,
    recentInvoices,
    currencies,
    revenueInvoices,
  ] = await Promise.all([
    prisma.client.count({
      where: {
        userId: user.id,
      },
    }),

    prisma.invoice.groupBy({
      by: ['status'],
      where: {
        userId: user.id,
      },
      _count: {
        _all: true,
      },
    }),

    prisma.invoice.groupBy({
      by: ['currency', 'status'],
      where: {
        userId: user.id,
        status: {
          in: ['PENDING', 'PAID'],
        },
      },
      _sum: {
        grandTotal: true,
      },
    }),

    prisma.invoice.groupBy({
      by: ['currency'],
      where: {
        userId: user.id,
        status: 'PENDING',
        dueDate: {
          lt: now,
        },
      },
      _sum: {
        grandTotal: true,
      },
    }),

    prisma.invoice.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        invoiceDate: 'desc',
      },
      take: 5,
      select: {
        id: true,
        slug: true,
        invoiceNumber: true,
        clientName: true,
        invoiceDate: true,
        dueDate: true,
        status: true,
        currency: true,
        grandTotal: true,
      },
    }),

    prisma.currency.findMany({
      where: {
        userId: user.id,
      },
      select: {
        code: true,
        name: true,
        symbol: true,
      },
    }),

    prisma.invoice.findMany({
      where: {
        userId: user.id,
        status: 'PAID',
        invoiceDate: {
          gte: revenueStartDate,
        },
      },
      orderBy: {
        invoiceDate: 'asc',
      },
      select: {
        invoiceDate: true,
        currency: true,
        grandTotal: true,
      },
    }),
  ]);

  const getStatusCount = (
    status: 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED',
  ) => {
    return (
      invoiceCounts.find((item) => item.status === status)?._count._all ?? 0
    );
  };

  const currencyMap = new Map(
    currencies.map((currency) => [currency.code, currency]),
  );

  const formatCurrencyAmount = (currency: string, amount: number) => ({
    currency,
    symbol: currencyMap.get(currency)?.symbol ?? currency,
    amount,
  });

  const revenue = monetaryAggregates
    .filter((item) => item.status === 'PAID')
    .map((item) =>
      formatCurrencyAmount(
        item.currency,
        item._sum.grandTotal?.toNumber() ?? 0,
      ),
    );

  const outstanding = monetaryAggregates
    .filter((item) => item.status === 'PENDING')
    .map((item) =>
      formatCurrencyAmount(
        item.currency,
        item._sum.grandTotal?.toNumber() ?? 0,
      ),
    );

  const overdue = overdueAggregates.map((item) =>
    formatCurrencyAmount(item.currency, item._sum.grandTotal?.toNumber() ?? 0),
  );

  const revenueByCurrency = new Map<string, Map<string, number>>();

  for (let index = 0; index < REVENUE_MONTHS; index++) {
    const monthDate = new Date(
      revenueStartDate.getFullYear(),
      revenueStartDate.getMonth() + index,
      1,
    );

    const monthKey = [
      monthDate.getFullYear(),
      String(monthDate.getMonth() + 1).padStart(2, '0'),
    ].join('-');

    for (const currency of currencies) {
      if (!revenueByCurrency.has(currency.code)) {
        revenueByCurrency.set(currency.code, new Map());
      }

      revenueByCurrency.get(currency.code)!.set(monthKey, 0);
    }
  }

  for (const invoice of revenueInvoices) {
    const invoiceMonth = new Date(
      invoice.invoiceDate.getFullYear(),
      invoice.invoiceDate.getMonth(),
      1,
    );

    const monthKey = [
      invoiceMonth.getFullYear(),
      String(invoiceMonth.getMonth() + 1).padStart(2, '0'),
    ].join('-');

    const currencyRevenue = revenueByCurrency.get(invoice.currency);

    if (!currencyRevenue || !currencyRevenue.has(monthKey)) {
      continue;
    }

    const currentAmount = currencyRevenue.get(monthKey) ?? 0;

    currencyRevenue.set(
      monthKey,
      currentAmount + invoice.grandTotal.toNumber(),
    );
  }

  const revenueMonths = Array.from({ length: REVENUE_MONTHS }, (_, index) => {
    const monthDate = new Date(
      revenueStartDate.getFullYear(),
      revenueStartDate.getMonth() + index,
      1,
    );

    const monthKey = [
      monthDate.getFullYear(),
      String(monthDate.getMonth() + 1).padStart(2, '0'),
    ].join('-');

    return {
      key: monthKey,
      label: new Intl.DateTimeFormat('en-US', {
        month: 'short',
      }).format(monthDate),
    };
  });

  const revenueChart = Array.from(revenueByCurrency.entries())
    .map(([currency, monthlyRevenue]) => ({
      currency,
      symbol: currencyMap.get(currency)?.symbol ?? currency,
      data: revenueMonths.map((month) => ({
        month: month.label,
        revenue: monthlyRevenue.get(month.key) ?? 0,
      })),
    }))
    .filter((currencyRevenue) =>
      currencyRevenue.data.some((month) => month.revenue > 0),
    );

  return {
    success: true as const,

    data: {
      stats: {
        clients: clientCount,

        invoices:
          getStatusCount('DRAFT') +
          getStatusCount('PENDING') +
          getStatusCount('PAID') +
          getStatusCount('CANCELLED'),

        pending: getStatusCount('PENDING'),
        paid: getStatusCount('PAID'),

        revenue,
        outstanding,
        overdue,
      },

      revenue: revenueChart,

      recentInvoices: recentInvoices.map((invoice) => ({
        ...invoice,
        grandTotal: invoice.grandTotal.toNumber(),
      })),
    },
  };
}
