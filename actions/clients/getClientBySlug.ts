'use server';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

export async function getClientBySlug(slug: string) {
  const { user } = await requireAuthentication();

  const client = await prisma.client.findFirst({
    where: {
      slug,
      userId: user.id,
    },
  });

  if (!client) {
    return {
      success: false,
      message: 'Client not found.',
      client: null,
    };
  }

  return {
    success: true,
    message: 'Client fetched successfully.',
    client,
  };
}
