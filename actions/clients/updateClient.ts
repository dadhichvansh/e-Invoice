'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';
import { ClientInput, clientSchema } from '@/lib/validators/client';

export async function updateClient(id: string, input: ClientInput) {
  const { user } = await requireAuthentication();

  const validatedInput = clientSchema.safeParse(input);

  if (!validatedInput.success) {
    return {
      success: false,
      message:
        validatedInput.error.issues[0]?.message ?? 'Invalid client details.',
    };
  }

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

  const {
    name,
    email,
    company,
    phone,
    address,
    city,
    state,
    postalCode,
    country,
    website,
    notes,
  } = validatedInput.data;

  const updatedClient = await prisma.client.update({
    where: {
      id: client.id,
    },
    data: {
      name: name,
      email: email,
      company: company || null,
      phone: phone || null,
      address: address || null,
      city: city || null,
      state: state || null,
      postalCode: postalCode || null,
      country: country || null,
      website: website || null,
      notes: notes || null,
    },
  });

  revalidatePath('/clients');
  revalidatePath(`/clients/${client.slug}/edit`);

  return {
    success: true,
    message: 'Client updated successfully.',
    client: updatedClient,
  };
}
