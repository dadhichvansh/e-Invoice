'use server';

import { prisma } from '@/lib/db/prisma';
import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { paymentMethodSchema } from '@/lib/validators/paymentMethod';

type PaymentMethodFieldErrors = {
  name?: string[];
  type?: string[];
  details?: string[];
  isDefault?: string[];
};

export async function createPaymentMethod(input: unknown) {
  try {
    const { user } = await requireAuthentication();

    const result = paymentMethodSchema.safeParse(input);

    if (!result.success) {
      const fieldErrors: PaymentMethodFieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (
          field === 'name' ||
          field === 'type' ||
          field === 'details' ||
          field === 'isDefault'
        ) {
          fieldErrors[field] ??= [];
          fieldErrors[field].push(issue.message);
        }
      }

      return {
        success: false,
        message: 'Please correct the highlighted fields.',
        fieldErrors,
      };
    }

    const { name, type, details, isDefault } = result.data;

    const existingPaymentMethodCount = await prisma.paymentMethod.count({
      where: {
        userId: user.id,
      },
    });

    const shouldBeDefault = existingPaymentMethodCount === 0 || isDefault;

    if (shouldBeDefault) {
      await prisma.$transaction([
        prisma.paymentMethod.updateMany({
          where: {
            userId: user.id,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        }),

        prisma.paymentMethod.create({
          data: {
            userId: user.id,
            name,
            type,
            details,
            isDefault: true,
          },
        }),
      ]);
    } else {
      await prisma.paymentMethod.create({
        data: {
          userId: user.id,
          name,
          type,
          details,
          isDefault: false,
        },
      });
    }

    return {
      success: true,
      message: 'Payment method added successfully.',
    };
  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
      fieldErrors: {},
    };
  }
}
