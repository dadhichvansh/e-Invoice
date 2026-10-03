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
    .toUpperCase()
    .length(3, 'Category code must be exactly 3 characters.')
    .regex(
      /^[A-Z0-9]+$/,
      'Category code can only contain uppercase letters and numbers.',
    ),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required.')
    .max(255, 'Description must be 255 characters or less.'),
});

export type InvoiceCategoryInput = z.infer<typeof invoiceCategorySchema>;
