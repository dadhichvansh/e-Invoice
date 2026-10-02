import { env } from '../env';

export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';
export const ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS = 15 * 60; // 15m in seconds
export const REFRESH_TOKEN_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30d in seconds

export const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production', // true in production environment only
  sameSite: 'lax' as const,
  path: '/',
} as const;
