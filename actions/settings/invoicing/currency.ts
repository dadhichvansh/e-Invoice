'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';
import { currencySchema, type CurrencyInput } from '@/lib/validators/currency';

export async function createCurrency(input: CurrencyInput) {
  const { user } = await requireAuthentication();

  const validatedInput = currencySchema.safeParse(input);

  if (!validatedInput.success) {
    return {
      success: false,
      message:
        validatedInput.error.issues[0]?.message ?? 'Invalid currency details.',
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

export async function updateCurrency(currencyId: string, input: CurrencyInput) {
  const { user } = await requireAuthentication();

  const validatedInput = currencySchema.safeParse(input);

  if (!validatedInput.success) {
    return {
      success: false,
      message:
        validatedInput.error.issues[0]?.message ?? 'Invalid currency details.',
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
