'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';
import {
  invoicingSettingsSchema,
  type InvoicingSettingsInput,
} from '@/lib/validators/invoicingSettings';

export async function updateInvoicingSettings(input: InvoicingSettingsInput) {
  const { user } = await requireAuthentication();

  const validatedInput = invoicingSettingsSchema.safeParse(input);

  if (!validatedInput.success) {
    return {
      success: false,
      message:
        validatedInput.error.issues[0]?.message ??
        'Invalid invoicing settings.',
    };
  }

  const { invoicePrefix, defaultCurrency, defaultPaymentTerms, defaultNotes } =
    validatedInput.data;

  const settings = await prisma.invoicingSettings.upsert({
    where: {
      userId: user.id,
    },

    create: {
      userId: user.id,
      invoicePrefix: invoicePrefix || null,
      defaultCurrency: defaultCurrency,
      defaultPaymentTerms: defaultPaymentTerms,
      defaultNotes: defaultNotes || null,
    },

    update: {
      invoicePrefix: invoicePrefix || null,
      defaultCurrency: defaultCurrency,
      defaultPaymentTerms: defaultPaymentTerms,
      defaultNotes: defaultNotes || null,
    },
  });

  revalidatePath('/settings/invoicing');

  return {
    success: true,
    message: 'Invoicing settings updated successfully.',
    settings,
  };
}
