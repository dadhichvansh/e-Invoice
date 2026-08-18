import 'server-only';

import { createHash, randomUUID } from 'node:crypto';

import { prisma } from '@/lib/db/prisma';
import {
  createAccessToken,
  createRefreshToken,
} from '@/lib/authentication/tokens';
import { SESSION_DURATION_MS } from '@/lib/constants/authentication';

function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function createAuthSession(userId: string) {
  const sessionId = randomUUID();

  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const accessToken = await createAccessToken(userId, sessionId);
  const refreshToken = await createRefreshToken(userId, sessionId);

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      refreshToken: refreshTokenHash,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    sessionId: session.id,
    expiresAt,
  };
}

export async function getAuthSession(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    return null;
  }

  return session;
}

export async function refreshAuthSession(
  sessionId: string,
  userId: string,
  refreshToken: string,
) {
  const session = await getAuthSession(sessionId);

  if (!session || session.userId !== userId) {
    return null;
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);

  if (refreshTokenHash !== session.refreshToken) {
    return null;
  }

  const newAccessToken = await createAccessToken(userId, sessionId);
  const newRefreshToken = await createRefreshToken(userId, sessionId);

  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      refreshToken: newRefreshTokenHash,
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionId,
  };
}
