'use server';

import { prisma } from '@/lib/db/prisma';
import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import {
  EMAIL_CHANGE_VERIFICATION_CODE_EXPIRY_MS,
  EMAIL_CHANGE_VERIFICATION_CODE_RESEND_COOLDOWN_MS,
} from '@/lib/constants/authentication';
import { generateCode, hashCode } from '@/lib/authentication/verificationCode';
import { requestEmailChangeSchema } from '@/lib/validators/settings';
import { sendEmailChangeCode } from '@/services/email.service';

type RequestEmailChangeResult =
  | {
      success: true;
      message: string;
      verificationId: string;
      email: string;
      cooldownSeconds: number;
    }
  | {
      success: false;
      message: string;
      cooldownSeconds?: number;
    };

export async function requestEmailChange(
  input: unknown,
): Promise<RequestEmailChangeResult> {
  try {
    const { user } = await requireAuthentication();

    const result = requestEmailChangeSchema.safeParse(input);

    if (!result.success) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    const newEmail = result.data.newEmail.trim().toLowerCase();

    if (newEmail === user.email.toLowerCase()) {
      return {
        success: false,
        message: 'This is already your current email address.',
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: newEmail,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'This email address is already in use.',
      };
    }

    const existingVerification = await prisma.emailChangeVerification.findFirst(
      {
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    );

    if (existingVerification) {
      const cooldownExpiresAt = new Date(
        existingVerification.createdAt.getTime() +
          EMAIL_CHANGE_VERIFICATION_CODE_RESEND_COOLDOWN_MS,
      );

      if (cooldownExpiresAt > new Date()) {
        const remainingSeconds = Math.ceil(
          (cooldownExpiresAt.getTime() - Date.now()) / 1000,
        );

        return {
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting another code.`,
          cooldownSeconds: remainingSeconds,
        };
      }

      // Previous request is no longer inside the cooldown window.
      await prisma.emailChangeVerification.delete({
        where: {
          id: existingVerification.id,
        },
      });
    }

    const code = generateCode();
    const codeHash = hashCode(code);

    const verification = await prisma.emailChangeVerification.create({
      data: {
        userId: user.id,
        newEmail,
        code: codeHash,
        expiresAt: new Date(
          Date.now() + EMAIL_CHANGE_VERIFICATION_CODE_EXPIRY_MS,
        ),
      },
    });

    try {
      await sendEmailChangeCode(newEmail, code);
    } catch {
      await prisma.emailChangeVerification.delete({
        where: {
          id: verification.id,
        },
      });

      return {
        success: false,
        message: 'Unable to send the verification code. Please try again.',
      };
    }

    return {
      success: true,
      message: 'Verification code sent to your new email address.',
      verificationId: verification.id,
      email: newEmail,
      cooldownSeconds: 60,
    };
  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
