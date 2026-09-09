'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';
import {
  invoiceCategorySchema,
  type InvoiceCategoryInput,
} from '@/lib/validators/invoiceCategory';
import { Prisma } from '@/lib/db/generated/prisma/client';

export async function createInvoiceCategory(input: InvoiceCategoryInput) {
  const { user } = await requireAuthentication();

  const validatedInput = invoiceCategorySchema.safeParse(input);

  if (!validatedInput.success) {
    return {
      success: false,
      message: validatedInput.error.issues[0]?.message ?? 'Invalid category.',
    };
  }

  const { name, code, description } = validatedInput.data;

  try {
    const category = await prisma.invoiceCategory.create({
      data: {
        userId: user.id,
        name: name,
        code: code,
        description: description || null,
      },
    });

    revalidatePath('/settings/invoicing');

    return {
      success: true,
      message: 'Invoice category created successfully.',
      category,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        message: 'A category with this code already exists.',
      };
    }

    throw error;
  }
}

export async function updateInvoiceCategory(
  id: string,
  input: InvoiceCategoryInput,
) {
  const { user } = await requireAuthentication();

  const validatedInput = invoiceCategorySchema.safeParse(input);

  if (!validatedInput.success) {
    return {
      success: false,
      message: validatedInput.error.issues[0]?.message ?? 'Invalid category.',
    };
  }

  const { name, code, description } = validatedInput.data;

  try {
    const category = await prisma.invoiceCategory.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        name: name,
        code: code,
        description: description || null,
      },
    });

    revalidatePath('/settings/invoicing');

    return {
      success: true,
      message: 'Invoice category updated successfully.',
      category,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        message: 'A category with this code already exists.',
      };
    }

    throw error;
  }
}

export async function deleteInvoiceCategory(id: string) {
  const { user } = await requireAuthentication();

  const category = await prisma.invoiceCategory.findFirst({
    where: {
      id,
      userId: user.id,
      isActive: true,
    },
  });

  if (!category) {
    return {
      success: false,
      message: 'Invoice category not found.',
    };
  }

  await prisma.invoiceCategory.delete({
    where: {
      id: category.id,
    },
  });

  revalidatePath('/settings/invoicing');

  return {
    success: true,
    message: 'Invoice category deleted successfully.',
  };
}
