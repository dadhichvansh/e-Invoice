import { z } from 'zod';

export const invoiceCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required.')
    .max(100, 'Category name must be 100 characters or less.'),
  code: z
    .string()
    .trim()
    .min(1, 'Category code is required.')
    .max(3, 'Category code must be 3 characters or less.')
    .regex(
      /^[A-Z0-9]+$/,
      'Category code can only contain uppercase letters and numbers.',
    ),
  description: z
    .string()
    .trim()
    .max(255, 'Description must be 255 characters or less.')
    .optional()
    .or(z.literal('')),
});

export type InvoiceCategoryInput = z.infer<typeof invoiceCategorySchema>;
