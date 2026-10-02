import { redirect } from 'next/navigation';

import { getAccessToken } from './cookies';
import { verifyAccessToken } from './tokens';

import { getAuthSession } from '@/services/authentication.service';

export async function requireGuest() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return;
  }

  let isAuthenticated = false;

  try {
    const payload = await verifyAccessToken(accessToken);

    const session = await getAuthSession(payload.sessionId);

    isAuthenticated = !!session && session.userId === payload.sub;
  } catch {
    // Invalid or expired access token.
    // The user is treated as unauthenticated.
    isAuthenticated = false;
  }

  if (isAuthenticated) {
    redirect('/');
  }
}
