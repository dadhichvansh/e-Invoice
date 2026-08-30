'use server';

import { prisma } from '@/lib/db/prisma';
import { requireAuthentication } from '@/lib/authentication/requireAuthentication';

type PaymentMethodFieldErrors = {
  id?: string[];
};

export async function deletePaymentMethod(input: unknown) {
  const { user } = await requireAuthentication();

  try {
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
        } satisfies PaymentMethodFieldErrors,
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
        } satisfies PaymentMethodFieldErrors,
      };
    }

    await prisma.paymentMethod.delete({
      where: {
        id: paymentMethodId,
      },
    });

    return {
      success: true,
      message: 'Payment method deleted successfully.',
    };
  } catch (error) {
    console.error('deletePaymentMethod error:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
      fieldErrors: {},
    };
  }
}
