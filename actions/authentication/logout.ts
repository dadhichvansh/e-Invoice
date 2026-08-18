'use server';

import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
} from '@/lib/authentication/cookies';

import {
  verifyAccessToken,
  verifyRefreshToken,
} from '@/lib/authentication/tokens';

import { deleteAuthSession } from '@/services/authentication.service';

export type LogoutState = {
  success: boolean;
  message: string;
};

export async function logout(): Promise<LogoutState> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  let sessionId: string | null = null;

  if (accessToken) {
    try {
      const payload = await verifyAccessToken(accessToken);

      sessionId = payload.sessionId;
    } catch {
      // Access token is expired/invalid.
    }
  }

  if (!sessionId && refreshToken) {
    try {
      const payload = await verifyRefreshToken(refreshToken);

      sessionId = payload.sessionId;
    } catch {
      // Refresh token is expired/invalid.
    }
  }

  if (sessionId) {
    await deleteAuthSession(sessionId);
  }

  await clearAuthCookies();

  return {
    success: true,
    message: 'Logged out successfully',
  };
}
