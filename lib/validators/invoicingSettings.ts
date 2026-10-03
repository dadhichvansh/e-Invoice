import { z } from 'zod';

export const invoicingSettingsSchema = z.object({
  invoicePrefix: z
    .string()
    .trim()
    .max(8, 'Invoice prefix must be 8 characters or less.')
    .optional()
    .or(z.literal('')),
  defaultCurrency: z
    .string()
    .trim()
    .min(1, 'Default currency is required.')
    .max(3, 'Invalid currency code.'),
  defaultPaymentTerms: z
    .number()
    .int('Payment terms must be a whole number.')
    .min(0, 'Payment terms cannot be negative.'),
  defaultNotes: z
    .string()
    .trim()
    .max(2000, 'Default notes must be 2000 characters or less.')
    .optional()
    .or(z.literal('')),
});

export type InvoicingSettingsInput = z.infer<typeof invoicingSettingsSchema>;
