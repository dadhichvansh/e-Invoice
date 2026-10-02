import { NextRequest, NextResponse } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS,
  ACCESS_TOKEN_COOKIE_NAME,
  BASE_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_MAX_AGE_SECONDS,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@/lib/constants/cookies';

import {
  verifyAccessToken,
  verifyRefreshToken,
} from '@/lib/authentication/tokens';

import { refreshAuthSession } from '@/services/authentication.service';

function setAuthCookies(
  request: NextRequest,
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  // Make the refreshed tokens available to the current request.
  request.cookies.set(ACCESS_TOKEN_COOKIE_NAME, accessToken);
  request.cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken);

  // Persist the refreshed tokens in the browser.
  response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_SECONDS,
  });
}

function clearAuthCookies(request: NextRequest, response: NextResponse) {
  request.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);
  request.cookies.delete(REFRESH_TOKEN_COOKIE_NAME);

  response.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);
  response.cookies.delete(REFRESH_TOKEN_COOKIE_NAME);
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  /*
   * Access token is still valid.
   * Continue normally without touching the refresh token.
   */
  if (accessToken) {
    try {
      await verifyAccessToken(accessToken);

      return NextResponse.next();
    } catch {
      // Access token is expired or invalid.
      // Continue below and attempt a refresh.
    }
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  /*
   * No refresh token means there is nothing the proxy can refresh.
   * Let requireAuthentication() handle the unauthenticated request.
   */
  if (!refreshToken) {
    return NextResponse.next();
  }

  try {
    const payload = await verifyRefreshToken(refreshToken);

    const session = await refreshAuthSession(
      payload.sessionId,
      payload.sub,
      refreshToken,
    );

    /*
     * Refresh token is invalid/revoked/session no longer exists.
     * Do not redirect here.
     *
     * requireAuthentication() will eventually redirect
     * the user to /login.
     */
    if (!session) {
      const response = NextResponse.next();

      clearAuthCookies(request, response);

      return response;
    }

    const response = NextResponse.next();

    /*
     * Refresh succeeded.
     *
     * IMPORTANT:
     * There is NO redirect here.
     *
     * The original request continues to its original URL.
     */
    setAuthCookies(
      request,
      response,
      session.accessToken,
      session.refreshToken,
    );

    return response;
  } catch {
    const response = NextResponse.next();

    clearAuthCookies(request, response);

    return response;
  }
}

export const config = {
  matcher: [
    '/login',
    '/',
    '/clients/:path*',
    '/invoices/:path*',
    '/settings/:path*',
    '/api/invoice/:path*',
  ],
};
