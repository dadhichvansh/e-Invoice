import { z } from 'zod';

export const requestEmailChangeSchema = z.object({
  newEmail: z.email(),
});

export type requestEmailChangeInput = z.infer<typeof requestEmailChangeSchema>;

export const verifyEmailChangeSchema = z.object({
  verificationId: z.uuid(),
  code: z.string().regex(/^\d{6}$/, 'Verification code must be 6 digits.'),
});

export type verifyEmailChangeInput = z.infer<typeof verifyEmailChangeSchema>;

export const updateNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters.')
    .max(100, 'Name must be less than 100 characters.'),
});

export type updateNameInput = z.infer<typeof updateNameSchema>;

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters.')
      .max(128, 'New password must be less than 128 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type updatePasswordInput = z.infer<typeof updatePasswordSchema>;
