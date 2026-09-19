import { z } from 'zod';

export const invoiceItemSchema = z.object({
  description: z.string().trim().min(1, 'Item description is required.'),
  quantity: z.number().positive('Quantity must be greater than 0.'),
  rate: z.number().nonnegative('Rate cannot be negative.'),
});

export const createInvoiceSchema = z.object({
  clientId: z.uuid('Please select a valid client.').trim(),

  invoiceCategoryId: z
    .uuid('Please select a valid invoice category.')
    .trim()
    .nullable()
    .optional(),

  paymentMethodId: z
    .uuid('Please select a valid payment method.')
    .trim()
    .nullable()
    .optional(),

  invoiceDate: z.coerce.date(),

  dueDate: z.coerce.date(),

  currency: z.string().trim().min(1, 'Currency is required.'),

  status: z.enum(
    ['DRAFT', 'PENDING', 'PAID', 'CANCELLED'],
    'Please select a valid invoice status.',
  ),

  projectName: z
    .string()
    .trim()
    .max(255, 'Project name is too long.')
    .nullable()
    .optional(),

  projectDescription: z.string().trim().nullable().optional(),

  discountPercentage: z
    .number()
    .min(0, 'Discount cannot be negative.')
    .max(100, 'Discount cannot exceed 100%.'),

  paymentReference: z
    .string()
    .trim()
    .max(255, 'Payment reference is too long.')
    .nullable()
    .optional(),

  notes: z.string().trim().nullable().optional(),

  terms: z.string().trim().nullable().optional(),

  items: z
    .array(invoiceItemSchema)
    .min(1, 'At least one invoice item is required.'),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
