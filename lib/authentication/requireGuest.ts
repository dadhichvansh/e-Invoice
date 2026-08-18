import { redirect } from 'next/navigation';

import { getAccessToken, getRefreshToken } from './cookies';
import { verifyAccessToken, verifyRefreshToken } from './tokens';

import { getAuthSession } from '@/services/authentication.service';

export async function requireGuest() {
  const accessToken = await getAccessToken();

  /*
   * 1. Check access token.
   */
  if (accessToken) {
    let authenticated = false;

    try {
      const payload = await verifyAccessToken(accessToken);
      const session = await getAuthSession(payload.sessionId);

      authenticated = !!session && session.userId === payload.sub;
    } catch {
      authenticated = false;
    }

    if (authenticated) {
      redirect('/');
    }
  }

  /*
   * 2. Access token is invalid/expired.
   *    Check refresh token.
   */
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return;
  }

  let hasValidSession = false;

  try {
    const payload = await verifyRefreshToken(refreshToken);
    const session = await getAuthSession(payload.sessionId);

    hasValidSession = !!session && session.userId === payload.sub;
  } catch {
    hasValidSession = false;
  }

  if (hasValidSession) {
    redirect('/api/authentication/refresh');
  }
}
