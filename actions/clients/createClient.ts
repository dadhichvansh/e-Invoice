'use server';

import { revalidatePath } from 'next/cache';
import { createHash, randomUUID } from 'crypto';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';
import { ClientInput, clientSchema } from '@/lib/validators/client';
import { createSlug } from '@/lib/utils';

export async function createClient(input: ClientInput) {
  const { user } = await requireAuthentication();

  const validatedInput = clientSchema.safeParse(input);

  if (!validatedInput.success) {
    return {
      success: false,
      message:
        validatedInput.error.issues[0]?.message ?? 'Invalid client details.',
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

  const id = randomUUID();
  const hash = createHash('sha256').update(id).digest('hex').slice(0, 8);

  const baseSlug = createSlug(validatedInput.data.name) || 'client';
  const slug = `${baseSlug}-${hash}`;

  const client = await prisma.client.create({
    data: {
      userId: user.id,
      name: name,
      slug: slug,
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

  return {
    success: true,
    message: 'Client created successfully.',
    client,
  };
}
