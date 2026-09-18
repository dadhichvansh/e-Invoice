'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

export async function deleteClient(id: string) {
  const { user } = await requireAuthentication();

  const client = await prisma.client.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!client) {
    return {
      success: false,
      message: 'Client not found.',
    };
  }

  await prisma.client.delete({
    where: {
      id: client.id,
    },
  });

  revalidatePath('/clients');

  return {
    success: true,
    message: 'Client deleted successfully.',
  };
}
