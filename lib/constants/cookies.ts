import { env } from '../env';

const isProduction: boolean = env.NODE_ENV === 'production'; // true in production environment only

export const ACCESS_TOKEN_COOKIE_NAME: string = 'access_token';
export const REFRESH_TOKEN_COOKIE_NAME: string = 'refresh_token';

export const ACCESS_TOKEN_COOKIE_MAX_AGE_DAYS: number = 15 * 60; // 15d
export const REFRESH_TOKEN_COOKIE_MAX_AGE_DAYS: number = 30 * 24 * 60 * 60; // 30d

export const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
} as const;
