'use server';

import { prisma } from '@/lib/db/prisma';
import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { UpdateNameSchema } from '@/lib/validators/settings';

export async function updateName(input: unknown) {
  try {
    const { user } = await requireAuthentication();

    const result = UpdateNameSchema.safeParse(input);

    if (!result.success) {
      return {
        success: false,
        message: 'Please enter a valid name.',
      };
    }

    const name = result.data.name;

    if (name === user.name) {
      return {
        success: true,
        message: 'No changes were made.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      success: true,
      message: 'Name updated successfully.',
      user: updatedUser,
    };
  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
