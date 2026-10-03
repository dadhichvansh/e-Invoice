'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';
import {
  invoicingSettingsSchema,
  type InvoicingSettingsInput,
} from '@/lib/validators/invoicingSettings';

type InvoicingSettingsFieldErrors = Partial<
  Record<keyof InvoicingSettingsInput, string>
>;

type UpdateInvoicingSettingsResult =
  | {
      success: true;
      message: string;
      settings: Awaited<ReturnType<typeof prisma.invoicingSettings.upsert>>;
    }
  | {
      success: false;
      message: string;
      fieldErrors: InvoicingSettingsFieldErrors;
    };

export async function updateInvoicingSettings(
  input: unknown,
): Promise<UpdateInvoicingSettingsResult> {
  const { user } = await requireAuthentication();

  const validatedInput = invoicingSettingsSchema.safeParse(input);

  if (!validatedInput.success) {
    const fieldErrors: InvoicingSettingsFieldErrors = {};

    for (const issue of validatedInput.error.issues) {
      const field = issue.path[0];

      if (typeof field === 'string' && !(field in fieldErrors)) {
        fieldErrors[field as keyof InvoicingSettingsInput] = issue.message;
      }
    }

    return {
      success: false,
      message: 'Please correct the highlighted fields.',
      fieldErrors,
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
      defaultCurrency,
      defaultPaymentTerms,
      defaultNotes: defaultNotes || null,
    },
    update: {
      invoicePrefix: invoicePrefix || null,
      defaultCurrency,
      defaultPaymentTerms,
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
