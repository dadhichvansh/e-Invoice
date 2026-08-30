'use server';

import { prisma } from '@/lib/db/prisma';
import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import {
  paymentMethodSchema,
  bankTransferDetailsSchema,
  upiDetailsSchema,
  paypalDetailsSchema,
  wiseDetailsSchema,
  otherDetailsSchema,
} from '@/lib/validators/paymentMethod';

type PaymentMethodDetailsFieldErrors = {
  accountHolderName?: string[];
  bankName?: string[];
  accountNumber?: string[];
  ifsc?: string[];
  swift?: string[];
  upiId?: string[];
  email?: string[];
  instructions?: string[];
};

type PaymentMethodFieldErrors = {
  id?: string[];
  name?: string[];
  type?: string[];
  details?: PaymentMethodDetailsFieldErrors;
  isDefault?: string[];
};

export async function updatePaymentMethod(input: unknown) {
  const { user } = await requireAuthentication();

  try {
    const result = paymentMethodSchema
      .extend({
        id: paymentMethodSchema.shape.name.transform(() => '').optional(),
      })
      .safeParse(input);

    if (!result.success) {
      return {
        success: false,
        message: 'Please correct the highlighted fields.',
        fieldErrors: {},
      };
    }

    const { name, type, details, isDefault } = result.data;

    const paymentMethodId =
      typeof input === 'object' &&
      input !== null &&
      'id' in input &&
      typeof input.id === 'string'
        ? input.id
        : '';

    if (!paymentMethodId) {
      return {
        success: false,
        message: 'Payment method not found.',
        fieldErrors: {
          id: ['Payment method ID is required.'],
        },
      };
    }

    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId: user.id,
      },
    });

    if (!existingPaymentMethod) {
      return {
        success: false,
        message: 'Payment method not found.',
        fieldErrors: {
          id: ['Payment method not found.'],
        },
      };
    }

    let detailsResult;

    switch (type) {
      case 'BANK_TRANSFER':
        detailsResult = bankTransferDetailsSchema.safeParse(details);
        break;

      case 'UPI':
        detailsResult = upiDetailsSchema.safeParse(details);
        break;

      case 'PAYPAL':
        detailsResult = paypalDetailsSchema.safeParse(details);
        break;

      case 'WISE':
        detailsResult = wiseDetailsSchema.safeParse(details);
        break;

      case 'OTHER':
        detailsResult = otherDetailsSchema.safeParse(details);
        break;
    }

    if (!detailsResult.success) {
      const fieldErrors: PaymentMethodFieldErrors = {
        details: {},
      };

      for (const issue of detailsResult.error.issues) {
        const detailField = issue.path[0];

        if (typeof detailField !== 'string') {
          continue;
        }

        fieldErrors.details![
          detailField as keyof PaymentMethodDetailsFieldErrors
        ] ??= [];

        fieldErrors.details![
          detailField as keyof PaymentMethodDetailsFieldErrors
        ]!.push(issue.message);
      }

      return {
        success: false,
        message: 'Please correct the highlighted fields.',
        fieldErrors,
      };
    }

    const shouldBeDefault = isDefault || existingPaymentMethod.isDefault;

    if (shouldBeDefault) {
      await prisma.$transaction([
        prisma.paymentMethod.updateMany({
          where: {
            userId: user.id,
            isDefault: true,
            id: {
              not: paymentMethodId,
            },
          },
          data: {
            isDefault: false,
          },
        }),

        prisma.paymentMethod.update({
          where: {
            id: paymentMethodId,
          },
          data: {
            name,
            type,
            details: detailsResult.data,
            isDefault: true,
          },
        }),
      ]);
    } else {
      await prisma.paymentMethod.update({
        where: {
          id: paymentMethodId,
        },
        data: {
          name,
          type,
          details: detailsResult.data,
          isDefault: false,
        },
      });
    }

    return {
      success: true,
      message: 'Payment method updated successfully.',
    };
  } catch (error) {
    console.error('updatePaymentMethod error:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
      fieldErrors: {},
    };
  }
}
