'use server';

import { revalidatePath } from 'next/cache';
import { createHash, randomUUID } from 'crypto';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';
import {
  createInvoiceSchema,
  type CreateInvoiceInput,
} from '@/lib/validators/invoice';
import { createSlug } from '@/lib/utils';

export async function createInvoice(input: CreateInvoiceInput) {
  const { user } = await requireAuthentication();

  const validatedInput = createInvoiceSchema.safeParse(input);

  if (!validatedInput.success) {
    return {
      success: false,
      message:
        validatedInput.error.issues[0]?.message ?? 'Invalid invoice details.',
    };
  }

  const {
    clientId,
    invoiceCategoryId,
    paymentMethodId,
    invoiceDate,
    dueDate,
    currency,
    projectName,
    projectDescription,
    discountPercentage,
    notes,
    terms,
    items,
  } = validatedInput.data;

  if (dueDate < invoiceDate) {
    return {
      success: false,
      message: 'Due date cannot be earlier than the invoice date.',
    };
  }

  await prisma.$transaction(async (tx) => {
    const client = await tx.client.findFirst({
      where: {
        id: clientId,
        userId: user.id,
      },
    });

    if (!client) {
      throw new Error('Client not found.');
    }

    let invoiceCategory = null;

    if (invoiceCategoryId) {
      invoiceCategory = await tx.invoiceCategory.findFirst({
        where: {
          id: invoiceCategoryId,
          userId: user.id,
          isActive: true,
        },
      });

      if (!invoiceCategory) {
        throw new Error('Invoice category not found.');
      }
    }

    const paymentMethod = await tx.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId: user.id,
      },
    });

    if (!paymentMethod) {
      throw new Error('Payment method not found.');
    }

    const settings = await tx.invoicingSettings.findUnique({
      where: {
        userId: user.id,
      },
    });

    const invoicePrefix = settings?.invoicePrefix?.trim() || 'EIVC';

    const id = randomUUID();

    const hash = createHash('sha256')
      .update(id)
      .digest('hex')
      .slice(0, 8)
      .toUpperCase();

    const invoiceDatePart = [
      String(invoiceDate.getDate()).padStart(2, '0'),
      String(invoiceDate.getMonth() + 1).padStart(2, '0'),
      invoiceDate.getFullYear(),
    ].join('');

    const invoiceCategoryPart = invoiceCategory
      ? createSlug(invoiceCategory.code).toUpperCase()
      : 'OTH';

    const invoiceNumber = [
      invoicePrefix.toUpperCase(),
      invoiceDatePart,
      invoiceCategoryPart,
      hash,
    ].join('');

    const slug = createSlug(invoiceNumber);

    const subtotal = items.reduce((total, item) => {
      return total + item.quantity * item.rate;
    }, 0);

    const discountAmount = subtotal * (discountPercentage / 100);

    const grandTotal = subtotal - discountAmount;

    return tx.invoice.create({
      data: {
        userId: user.id,
        slug: slug,

        clientId,
        invoiceCategoryId: invoiceCategory?.id ?? null,
        paymentMethodId: paymentMethod.id,

        invoiceNumber,

        invoiceDate,
        dueDate,

        currency,
        status: 'DRAFT',

        projectName: projectName || null,
        projectDescription: projectDescription || null,

        discountPercentage,

        notes: notes || null,
        terms: terms || null,

        subtotal,
        discountAmount,
        grandTotal,

        clientName: client.name,
        clientEmail: client.email,
        clientCompany: client.company,
        clientPhone: client.phone,
        clientAddress: client.address,
        clientCity: client.city,
        clientState: client.state,
        clientPostalCode: client.postalCode,
        clientCountry: client.country,

        paymentMethodName: paymentMethod.name,
        paymentMethodType: paymentMethod.type,
        paymentMethodDetails: paymentMethod.details ?? undefined,

        invoiceCategoryName: invoiceCategory?.name ?? null,
        invoiceCategoryCode: invoiceCategory?.code ?? null,
        invoiceCategoryDescription: invoiceCategory?.description ?? null,

        items: {
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

  return {
    success: true,
    message: 'Invoice created successfully.',
  };
}
