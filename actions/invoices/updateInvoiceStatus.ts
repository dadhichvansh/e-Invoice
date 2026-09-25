'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID';

export async function updateInvoiceStatus(slug: string, status: InvoiceStatus) {
  const { user } = await requireAuthentication();

  const invoice = await prisma.invoice.findFirst({
    where: {
      slug,
      userId: user.id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!invoice) {
    return {
      success: false,
      message: 'Invoice not found.',
    };
  }

  if (invoice.status === 'CANCELLED') {
    return {
      success: false,
      message: 'Cancelled invoices cannot have their status changed.',
    };
  }

  if (invoice.status === status) {
    return {
      success: true,
      message: 'Invoice status is already set to this value.',
    };
  }

  await prisma.invoice.update({
    where: {
      id: invoice.id,
    },
    data: {
      status,
    },
  });

  revalidatePath('/invoices');
  revalidatePath(`/invoices/${slug}`);
  revalidatePath(`/invoices/${slug}/edit`);

  return {
    success: true,
    message: 'Invoice status updated successfully.',
  };
}
