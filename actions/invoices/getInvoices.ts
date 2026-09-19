'use server';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

export async function getInvoices() {
  const { user } = await requireAuthentication();

  const invoices = await prisma.invoice.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      invoiceDate: 'desc',
    },
    select: {
      id: true,
      slug: true,
      invoiceNumber: true,
      clientId: true,
      clientName: true,
      projectName: true,
      invoiceDate: true,
      dueDate: true,
      status: true,
      currency: true,
      grandTotal: true,
    },
  });

  return {
    success: true,
    message: 'Invoices fetched successfully.',
    invoices: invoices.map((invoice) => ({
      ...invoice,
      grandTotal: invoice.grandTotal.toNumber(),
    })),
  };
}
