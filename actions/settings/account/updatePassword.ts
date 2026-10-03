'use server';

import { prisma } from '@/lib/db/prisma';
import { clearAuthCookies } from '@/lib/authentication/cookies';
import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { updatePasswordSchema } from '@/lib/validators/settings';
import { hashPassword, verifyPassword } from '@/lib/authentication/password';

export async function updatePassword(input: unknown) {
  try {
    const { user } = await requireAuthentication();

    const result = updatePasswordSchema.safeParse(input);

    if (!result.success) {
      return {
        success: false,
        message: 'Please check the password fields and try again.',
      };
    }

    const { currentPassword, newPassword } = result.data;

    const currentUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        password: true,
      },
    });

    if (!currentUser) {
      return {
        success: false,
        message: 'Unable to update your password. Please try again.',
      };
    }

    const isCurrentPasswordValid = await verifyPassword(
      currentPassword,
      currentUser.password,
    );

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: 'Current password is incorrect.',
      };
    }

    const isSamePassword = await verifyPassword(
      newPassword,
      currentUser.password,
    );

    if (isSamePassword) {
      return {
        success: false,
        message:
          'Your new password must be different from your current password.',
      };
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      await tx.session.deleteMany({
        where: {
          userId: user.id,
        },
      });
    });

    await clearAuthCookies();

    return {
      success: true,
      message:
        'Password changed successfully. Please log in again with your new password.',
    };
  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
