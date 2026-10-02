import 'server-only';

import { cookies } from 'next/headers';

import {
  ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS,
  ACCESS_TOKEN_COOKIE_NAME,
  BASE_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_MAX_AGE_SECONDS,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../constants/cookies';

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_SECONDS,
  });
}

export async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value ?? null;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();

  return cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value ?? null;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
}
