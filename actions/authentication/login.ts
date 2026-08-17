'use server';

import { setAuthCookies } from '@/lib/authentication/cookies';
import { verifyPassword } from '@/lib/authentication/password';
import { loginSchema } from '@/lib/validators/authentication';
import {
  createAuthSession,
  findUserByEmail,
} from '@/services/authentication.service';

export type LoginState = {
  success: boolean;
  message: string;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }

  const { email, password } = result.data;

  const user = await findUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }

  const passwordValid = await verifyPassword(password, user.password);

  if (!passwordValid) {
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }

  const session = await createAuthSession(user.id);

  await setAuthCookies(session.accessToken, session.refreshToken);

  return {
    success: true,
    message: 'Login successful',
  };
}
