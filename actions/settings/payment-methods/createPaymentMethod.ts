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
  name?: string[];
  type?: string[];
  details?: PaymentMethodDetailsFieldErrors;
  isDefault?: string[];
};

export async function createPaymentMethod(input: unknown) {
  const { user } = await requireAuthentication();

  try {
    const result = paymentMethodSchema.safeParse(input);

    if (!result.success) {
      const fieldErrors: PaymentMethodFieldErrors = {};

      for (const issue of result.error.issues) {
        const [field, detailField] = issue.path;

        if (field === 'name' || field === 'type' || field === 'isDefault') {
          fieldErrors[field] ??= [];
          fieldErrors[field].push(issue.message);

          continue;
        }

        if (field === 'details' && typeof detailField === 'string') {
          fieldErrors.details ??= {};
          fieldErrors.details[
            detailField as keyof PaymentMethodDetailsFieldErrors
          ] ??= [];
          fieldErrors.details[
            detailField as keyof PaymentMethodDetailsFieldErrors
          ]!.push(issue.message);
        }
      }

      return {
        success: false,
        message: 'Please correct the highlighted fields.',
        fieldErrors,
      };
    }

    const { name, type, details, isDefault } = result.data;

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
            details: detailsResult.data,
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
          details: detailsResult.data,
          isDefault: false,
        },
      });
    }

    return {
      success: true,
      message: 'Payment method added successfully.',
    };
  } catch (error) {
    console.error('createPaymentMethod error:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
      fieldErrors: {},
    };
  }
}
