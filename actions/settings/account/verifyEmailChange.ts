'use server';

import { prisma } from '@/lib/db/prisma';
import { clearAuthCookies } from '@/lib/authentication/cookies';
import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { hashCode } from '@/lib/authentication/verificationCode';
import { EMAIL_CHANGE_MAX_ATTEMPTS } from '@/lib/constants/authentication';
import { VerifyEmailChangeSchema } from '@/lib/validators/settings';

export async function verifyEmailChange(input: unknown) {
  try {
    const { user } = await requireAuthentication();

    const result = VerifyEmailChangeSchema.safeParse(input);

    if (!result.success) {
      return {
        success: false,
        message: 'Please enter a valid 6-digit verification code.',
      };
    }

    const { verificationId, code } = result.data;

    const verification = await prisma.emailChangeVerification.findFirst({
      where: {
        id: verificationId,
        userId: user.id,
      },
    });

    if (!verification) {
      return {
        success: false,
        message: 'This verification request is no longer valid.',
      };
    }

    if (verification.expiresAt <= new Date()) {
      await prisma.emailChangeVerification.delete({
        where: {
          id: verification.id,
        },
      });

      return {
        success: false,
        message:
          'This verification code has expired. Please request a new one.',
      };
    }

    if (verification.attempts >= EMAIL_CHANGE_MAX_ATTEMPTS) {
      await prisma.emailChangeVerification.delete({
        where: {
          id: verification.id,
        },
      });

      return {
        success: false,
        message: 'Too many attempts. Please request a new verification code.',
      };
    }

    const submittedCodeHash = hashCode(code);

    if (submittedCodeHash !== verification.code) {
      const updatedVerification = await prisma.emailChangeVerification.update({
        where: {
          id: verification.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
        select: {
          attempts: true,
        },
      });

      const attemptsRemaining =
        EMAIL_CHANGE_MAX_ATTEMPTS - updatedVerification.attempts;

      if (attemptsRemaining <= 0) {
        await prisma.emailChangeVerification.delete({
          where: {
            id: verification.id,
          },
        });

        return {
          success: false,
          message: 'Too many attempts. Please request a new verification code.',
        };
      }

      return {
        success: false,
        message: `Invalid verification code. ${attemptsRemaining} attempts remaining.`,
      };
    }

    /*
     * Re-check email uniqueness immediately before changing it.
     *
     * The email could have become registered by another account
     * after the Verification Code was initially requested.
     */
    const existingUser = await prisma.user.findUnique({
      where: {
        email: verification.newEmail,
      },
      select: {
        id: true,
      },
    });

    if (existingUser && existingUser.id !== user.id) {
      await prisma.emailChangeVerification.delete({
        where: {
          id: verification.id,
        },
      });

      return {
        success: false,
        message: 'This email address is no longer available.',
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: verification.newEmail,
        },
      });

      await tx.session.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await tx.emailChangeVerification.delete({
        where: {
          id: verification.id,
        },
      });
    });

    await clearAuthCookies();

    return {
      success: true,
      message:
        'Email address updated successfully. Please log in again with your new email.',
    };
  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
