'use server';

import { z } from 'zod';

import { prisma } from '@/lib/db/prisma';
import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { businessProfileSchema } from '@/lib/validators/businessProfile';

export async function updateBusinessProfile(input: unknown) {
  try {
    const { user } = await requireAuthentication();

    const result = businessProfileSchema.safeParse(input);

    if (!result.success) {
      const fieldErrors = z.treeifyError(result.error);

      return {
        success: false,
        message: 'Please correct the highlighted fields.',
        fieldErrors,
      };
    }

    const {
      businessName,
      email,
      phone,
      website,
      address,
      city,
      state,
      country,
      postalCode,
    } = result.data;

    await prisma.businessProfile.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        businessName: businessName ?? null,
        email: email ?? null,
        phone: phone ?? null,
        website: website ?? null,
        address: address ?? null,
        city: city ?? null,
        state: state ?? null,
        country: country ?? null,
        postalCode: postalCode ?? null,
      },
      update: {
        businessName: businessName ?? null,
        email: email ?? null,
        phone: phone ?? null,
        website: website ?? null,
        address: address ?? null,
        city: city ?? null,
        state: state ?? null,
        country: country ?? null,
        postalCode: postalCode ?? null,
      },
    });

    return {
      success: true,
      message: 'Business profile updated successfully.',
    };
  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
      fieldErrors: {},
    };
  }
}
