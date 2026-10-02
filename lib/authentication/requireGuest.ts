import { redirect } from 'next/navigation';

import { getAccessToken } from './cookies';
import { verifyAccessToken } from './tokens';

import { getAuthSession } from '@/services/authentication.service';

export async function requireGuest() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return;
  }

  try {
    const payload = await verifyAccessToken(accessToken);

    const session = await getAuthSession(payload.sessionId);

    if (session && session.userId === payload.sub) {
      redirect('/');
    }
  } catch {
    // Invalid or expired access token.
    // The user is not authenticated from this guard's perspective.
    return;
  }
}
