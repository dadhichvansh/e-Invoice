import { z } from 'zod';

export const RequestEmailChangeSchema = z.object({
  newEmail: z.email(),
});

export type RequestEmailChangeInput = z.infer<typeof RequestEmailChangeSchema>;

export const VerifyEmailChangeSchema = z.object({
  verificationId: z.uuid(),
  code: z.string().regex(/^\d{6}$/, 'Verification code must be 6 digits.'),
});

export type VerifyEmailChangeInput = z.infer<typeof VerifyEmailChangeSchema>;

export const UpdateNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must be less than 100 characters.'),
});

export type UpdateNameInput = z.infer<typeof UpdateNameSchema>;

export const UpdatePasswordSchema = z
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

export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
