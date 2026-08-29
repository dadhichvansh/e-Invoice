import { z } from 'zod';

export const paymentMethodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Payment method name is required.')
    .max(100, 'Payment method name must be 100 characters or less.'),

  type: z.enum(['BANK_TRANSFER', 'UPI', 'PAYPAL', 'WISE', 'OTHER']),

  details: z
    .string()
    .trim()
    .min(1, 'Payment details are required.')
    .max(2000, 'Payment details must be 2000 characters or less.'),

  isDefault: z.boolean(),
});

export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>;
