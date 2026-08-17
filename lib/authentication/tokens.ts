import 'server-only';
import { env } from '../env';
import { JWTPayload, jwtVerify, SignJWT } from 'jose';

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export type TokenPayload = Omit<JWTPayload, 'sub'> & {
  sub: string;
  sessionId: string;
  type: 'access' | 'refresh';
};

export async function createAccessToken(
  userId: string,
  sessionId: string,
): Promise<string> {
  return new SignJWT({
    sessionId,
    type: 'access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(env.ACCESS_TOKEN_EXPIRY)
    .sign(accessSecret);
}

export async function createRefreshToken(
  userId: string,
  sessionId: string,
): Promise<string> {
  return new SignJWT({
    sessionId,
    type: 'refresh',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(env.REFRESH_TOKEN_EXPIRY)
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, accessSecret, {
    algorithms: ['HS256'],
  });

  if (
    typeof payload.sub !== 'string' ||
    typeof payload.sessionId !== 'string' ||
    payload.type !== 'access'
  ) {
    throw new Error('Invalid access token payload');
  }

  return payload as TokenPayload;
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, refreshSecret, {
    algorithms: ['HS256'],
  });

  if (
    typeof payload.sub !== 'string' ||
    typeof payload.sessionId !== 'string' ||
    payload.type !== 'refresh'
  ) {
    throw new Error('Invalid refresh token payload');
  }

  return payload as TokenPayload;
}
