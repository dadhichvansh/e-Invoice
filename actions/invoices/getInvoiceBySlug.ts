'use server';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

export async function getInvoiceBySlug(slug: string) {
  const { user } = await requireAuthentication();

  const invoice = await prisma.invoice.findFirst({
    where: {
      slug,
      userId: user.id,
    },
    include: {
      items: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
  });

  if (!invoice) {
    return {
      success: false as const,
      message: 'Invoice not found.',
    };
  }

  return {
    success: true,
    message: 'Invoice fetched successfully.',
    invoice: {
      ...invoice,
      subtotal: invoice.subtotal.toNumber(),
      discountPercentage: invoice.discountPercentage.toNumber(),
      discountAmount: invoice.discountAmount.toNumber(),
      grandTotal: invoice.grandTotal.toNumber(),
      items: invoice.items.map((item) => ({
        ...item,
        quantity: item.quantity.toNumber(),
        rate: item.rate.toNumber(),
        amount: item.amount.toNumber(),
      })),
    },
  };
}
