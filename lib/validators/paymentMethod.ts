import { z } from 'zod';

export const bankTransferDetailsSchema = z.object({
  accountHolderName: z
    .string()
    .trim()
    .min(1, 'Account holder name is required.'),
  bankName: z.string().trim().min(1, 'Bank name is required.'),
  accountNumber: z.string().trim().min(1, 'Account number is required.'),
  ifsc: z.string().trim().toUpperCase().min(1, 'IFSC code is required.'),
  swift: z.string().trim().optional(),
});

export const upiDetailsSchema = z.object({
  upiId: z.string().trim().min(1, 'UPI ID is required.'),
});

export const paypalDetailsSchema = z.object({
  email: z.email('Enter a valid PayPal email.'),
});

export const wiseDetailsSchema = z.object({
  email: z.email('Enter a valid Wise email.'),
});

export const otherDetailsSchema = z.object({
  instructions: z.string().trim().min(1, 'Payment instructions are required.'),
});

export const paymentMethodSchema = z.object({
  name: z.string().trim().min(1, 'Payment method name is required.'),
  type: z.enum(['BANK_TRANSFER', 'UPI', 'PAYPAL', 'WISE', 'OTHER']),
  details: z.unknown(),
  isDefault: z.boolean(),
});
