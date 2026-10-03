'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';
import { currencySchema, type CurrencyInput } from '@/lib/validators/currency';

type CurrencyFieldErrors = Partial<Record<keyof CurrencyInput, string>>;

type CurrencyResult =
  | {
      success: true;
      message: string;
      currency?: Awaited<ReturnType<typeof prisma.currency.create>>;
    }
  | {
      success: false;
      message: string;
      fieldErrors: CurrencyFieldErrors;
    };

export async function createCurrency(input: unknown): Promise<CurrencyResult> {
  const { user } = await requireAuthentication();

  const validatedInput = currencySchema.safeParse(input);

  if (!validatedInput.success) {
    const fieldErrors: CurrencyFieldErrors = {};

    for (const issue of validatedInput.error.issues) {
      const field = issue.path[0];

      if (typeof field === 'string' && !(field in fieldErrors)) {
        fieldErrors[field as keyof CurrencyInput] = issue.message;
      }
    }

    return {
      success: false,
      message: 'Please correct the highlighted fields.',
      fieldErrors,
    };
  }

  const { code, name, symbol } = validatedInput.data;

  const existingCurrency = await prisma.currency.findUnique({
    where: {
      userId_code: {
        userId: user.id,
        code,
      },
    },
  });

  if (existingCurrency) {
    return {
      success: false,
      message: 'This currency has already been added.',
      fieldErrors: {
        code: 'This currency code has already been added.',
      },
    };
  }

  const currency = await prisma.currency.create({
    data: {
      userId: user.id,
      code,
      name,
      symbol,
    },
  });

  revalidatePath('/settings/invoicing');
  revalidatePath('/invoices/new');

  return {
    success: true,
    message: 'Currency added successfully.',
    currency,
  };
}

export async function updateCurrency(
  currencyId: string,
  input: unknown,
): Promise<CurrencyResult> {
  const { user } = await requireAuthentication();

  const validatedInput = currencySchema.safeParse(input);

  if (!validatedInput.success) {
    const fieldErrors: CurrencyFieldErrors = {};

    for (const issue of validatedInput.error.issues) {
      const field = issue.path[0];

      if (typeof field === 'string' && !(field in fieldErrors)) {
        fieldErrors[field as keyof CurrencyInput] = issue.message;
      }
    }

    return {
      success: false,
      message: 'Please correct the highlighted fields.',
      fieldErrors,
    };
  }

  const { code, name, symbol } = validatedInput.data;

  const existingCurrency = await prisma.currency.findFirst({
    where: {
      id: currencyId,
      userId: user.id,
    },
  });

  if (!existingCurrency) {
    return {
      success: false,
      message: 'Currency not found.',
      fieldErrors: {},
    };
  }

  const duplicateCurrency = await prisma.currency.findFirst({
    where: {
      userId: user.id,
      code,
      NOT: {
        id: currencyId,
      },
    },
  });

  if (duplicateCurrency) {
    return {
      success: false,
      message: 'This currency has already been added.',
      fieldErrors: {
        code: 'This currency code has already been added.',
      },
    };
  }

  const currency = await prisma.currency.update({
    where: {
      id: currencyId,
    },
    data: {
      code,
      name,
      symbol,
    },
  });

  revalidatePath('/settings/invoicing');
  revalidatePath('/invoices/new');

  return {
    success: true,
    message: 'Currency updated successfully.',
    currency,
  };
}

export async function deleteCurrency(currencyId: string) {
  const { user } = await requireAuthentication();

  const currency = await prisma.currency.findFirst({
    where: {
      id: currencyId,
      userId: user.id,
    },
  });

  if (!currency) {
    return {
      success: false,
      message: 'Currency not found.',
    };
  }

  await prisma.currency.delete({
    where: {
      id: currencyId,
    },
  });

  revalidatePath('/settings/invoicing');
  revalidatePath('/invoices/new');

  return {
    success: true,
    message: 'Currency deleted successfully.',
  };
}
