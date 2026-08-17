import { NextRequest, NextResponse } from 'next/server';

import {
  getRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from '@/lib/authentication/cookies';

import { verifyRefreshToken } from '@/lib/authentication/tokens';

import { refreshAuthSession } from '@/services/authentication.service';

export async function GET(request: NextRequest) {
  const redirectTo = (pathname: string) => {
    const url = request.nextUrl.clone();

    url.pathname = pathname;
    url.search = '';

    return NextResponse.redirect(url);
  };

  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await clearAuthCookies();

    return redirectTo('/login');
  }

  try {
    const payload = await verifyRefreshToken(refreshToken);

    const session = await refreshAuthSession(
      payload.sessionId,
      payload.sub,
      refreshToken,
    );

    if (!session) {
      await clearAuthCookies();

      return redirectTo('/login');
    }

    await setAuthCookies(session.accessToken, session.refreshToken);

    return redirectTo('/');
  } catch {
    await clearAuthCookies();

    return redirectTo('/login');
  }
}
