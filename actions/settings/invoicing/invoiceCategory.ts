'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';
import {
  invoiceCategorySchema,
  type InvoiceCategoryInput,
} from '@/lib/validators/invoiceCategory';
import { Prisma } from '@/lib/db/generated/prisma/client';

type InvoiceCategoryFieldErrors = Partial<
  Record<keyof InvoiceCategoryInput, string>
>;

type InvoiceCategoryResult =
  | {
      success: true;
      message: string;
      category?: Awaited<ReturnType<typeof prisma.invoiceCategory.create>>;
    }
  | {
      success: false;
      message: string;
      fieldErrors: InvoiceCategoryFieldErrors;
    };

export async function createInvoiceCategory(
  input: unknown,
): Promise<InvoiceCategoryResult> {
  const { user } = await requireAuthentication();

  const validatedInput = invoiceCategorySchema.safeParse(input);

  if (!validatedInput.success) {
    const fieldErrors: InvoiceCategoryFieldErrors = {};

    for (const issue of validatedInput.error.issues) {
      const field = issue.path[0];

      if (typeof field === 'string' && !(field in fieldErrors)) {
        fieldErrors[field as keyof InvoiceCategoryInput] = issue.message;
      }
    }

    return {
      success: false,
      message: 'Please correct the highlighted fields.',
      fieldErrors,
    };
  }

  const { name, code, description } = validatedInput.data;

  try {
    const category = await prisma.invoiceCategory.create({
      data: {
        userId: user.id,
        name,
        code,
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
        fieldErrors: {},
      };
    }

    throw error;
  }
}

export async function updateInvoiceCategory(
  id: string,
  input: unknown,
): Promise<InvoiceCategoryResult> {
  const { user } = await requireAuthentication();

  const validatedInput = invoiceCategorySchema.safeParse(input);

  if (!validatedInput.success) {
    const fieldErrors: InvoiceCategoryFieldErrors = {};

    for (const issue of validatedInput.error.issues) {
      const field = issue.path[0];

      if (typeof field === 'string' && !(field in fieldErrors)) {
        fieldErrors[field as keyof InvoiceCategoryInput] = issue.message;
      }
    }

    return {
      success: false,
      message: 'Please correct the highlighted fields.',
      fieldErrors,
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
        name,
        code,
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
        fieldErrors: {},
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
