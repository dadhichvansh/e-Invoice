'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

export async function cancelInvoice(slug: string) {
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
      message: 'Invoice is already cancelled.',
    };
  }

  await prisma.invoice.update({
    where: {
      id: invoice.id,
    },
    data: {
      status: 'CANCELLED',
    },
  });

  revalidatePath('/invoices');
  revalidatePath(`/invoices/${slug}/edit`);

  return {
    success: true,
    message: 'Invoice cancelled successfully.',
  };
}
