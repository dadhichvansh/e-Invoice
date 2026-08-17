import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),

  NODE_ENV: z.enum(['development', 'production']).default('development'),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRY: z.string().default('30d'),
});

export const env = envSchema.parse(process.env);
