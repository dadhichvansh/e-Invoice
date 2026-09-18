import { z } from 'zod';

export const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Client name is required.')
    .max(100, 'Client name must be 100 characters or less.'),
  email: z
    .email('Please enter a valid email address.')
    .trim()
    .min(1, 'Email is required.')
    .max(255, 'Email must be 255 characters or less.'),
  company: z
    .string()
    .trim()
    .max(150, 'Company name must be 150 characters or less.')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone number must be 30 characters or less.')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .max(255, 'Address must be 255 characters or less.')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .trim()
    .max(100, 'City must be 100 characters or less.')
    .optional()
    .or(z.literal('')),
  state: z
    .string()
    .trim()
    .max(100, 'State must be 100 characters or less.')
    .optional()
    .or(z.literal('')),
  postalCode: z
    .string()
    .trim()
    .max(20, 'Postal code must be 20 characters or less.')
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .trim()
    .max(100, 'Country must be 100 characters or less.')
    .optional()
    .or(z.literal('')),
  website: z
    .url('Please enter a valid website URL.')
    .trim()
    .max(255, 'Website must be 255 characters or less.')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .trim()
    .max(2000, 'Notes must be 2000 characters or less.')
    .optional()
    .or(z.literal('')),
});

export type ClientInput = z.infer<typeof clientSchema>;
