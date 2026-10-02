import { redirect } from 'next/navigation';

import { getAccessToken } from './cookies';
import { verifyAccessToken } from './tokens';

import { getAuthSession } from '@/services/authentication.service';

export async function requireAuthentication() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect('/login');
  }

  try {
    const payload = await verifyAccessToken(accessToken);

    const session = await getAuthSession(payload.sessionId);

    if (!session || session.userId !== payload.sub) {
      redirect('/login');
    }

    return {
      userId: payload.sub,
      sessionId: payload.sessionId,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    };
  } catch {
    redirect('/login');
  }
}
