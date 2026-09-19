import { z } from 'zod';

export const currencySchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .length(3, 'Currency code must contain exactly 3 characters.'),
  name: z
    .string()
    .trim()
    .min(1, 'Currency name is required.')
    .max(100, 'Currency name is too long.'),
  symbol: z
    .string()
    .trim()
    .min(1, 'Currency symbol is required.')
    .max(10, 'Currency symbol is too long.'),
});

export type CurrencyInput = z.infer<typeof currencySchema>;
