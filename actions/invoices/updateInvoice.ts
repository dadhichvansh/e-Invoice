'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';
import {
  updateInvoiceSchema,
  type UpdateInvoiceInput,
} from '@/lib/validators/invoice';

export async function updateInvoice(slug: string, input: UpdateInvoiceInput) {
  const { user } = await requireAuthentication();

  const validatedInput = updateInvoiceSchema.safeParse(input);

  if (!validatedInput.success) {
    return {
      success: false,
      message:
        validatedInput.error.issues[0]?.message ?? 'Invalid invoice details.',
    };
  }

  const {
    currency,
    status,
    discountPercentage,
    paymentReference,
    notes,
    terms,
    items,
  } = validatedInput.data;

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
      message: 'Cancelled invoices cannot be edited.',
    };
  }

  const currencyRecord = await prisma.currency.findFirst({
    where: {
      userId: user.id,
      code: currency,
    },
    select: {
      id: true,
    },
  });

  if (!currencyRecord) {
    return {
      success: false,
      message: 'Selected currency is no longer available.',
    };
  }

  const subtotal = items.reduce((total, item) => {
    return total + item.quantity * item.rate;
  }, 0);

  const discountAmount = subtotal * (discountPercentage / 100);
  const grandTotal = subtotal - discountAmount;

  await prisma.$transaction(async (tx) => {
    await tx.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        currency,
        status,
        discountPercentage,
        discountAmount,
        grandTotal,
        paymentReference: paymentReference || null,
        notes: notes || null,
        terms: terms || null,
        items: {
          deleteMany: {},
          create: items.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
            sortOrder: index,
          })),
        },
      },
    });
  });

  revalidatePath('/invoices');
  revalidatePath(`/invoices/${slug}/edit`);

  return {
    success: true,
    message: 'Invoice updated successfully.',
  };
}
