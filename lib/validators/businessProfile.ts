import { z } from 'zod';

export const businessProfileSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, 'Business name is required.')
    .max(100, 'Business name must be 100 characters or less.'),
  email: z
    .email('Enter a valid business email.')
    .trim()
    .max(255, 'Email must be 255 characters or less.')
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone number must be 30 characters or less.')
    .or(z.literal('')),
  website: z
    .url('Enter a valid website URL.')
    .trim()
    .max(255, 'Website must be 255 characters or less.')
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .max(255, 'Address must be 255 characters or less.')
    .or(z.literal('')),
  city: z
    .string()
    .trim()
    .max(100, 'City must be 100 characters or less.')
    .or(z.literal('')),
  state: z
    .string()
    .trim()
    .max(100, 'State must be 100 characters or less.')
    .or(z.literal('')),
  country: z
    .string()
    .trim()
    .max(100, 'Country must be 100 characters or less.')
    .or(z.literal('')),
  postalCode: z
    .string()
    .trim()
    .max(20, 'Postal code must be 20 characters or less.')
    .or(z.literal('')),
});

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;
