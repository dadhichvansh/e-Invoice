'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { updateBusinessProfile } from '@/actions/settings/business-profile/updateBusinessProfile';
import { businessProfileSchema } from '@/lib/validators/businessProfile';

interface BusinessProfileSettingsProps {
  profile: {
    businessName: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postalCode: string | null;
  } | null;
}

interface BusinessProfileFormData {
  businessName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

function getInitialFormData(
  profile: BusinessProfileSettingsProps['profile'],
): BusinessProfileFormData {
  return {
    businessName: profile?.businessName ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
    website: profile?.website ?? '',
    address: profile?.address ?? '',
    city: profile?.city ?? '',
    state: profile?.state ?? '',
    country: profile?.country ?? '',
    postalCode: profile?.postalCode ?? '',
  };
}

export function BusinessProfileSettings({
  profile,
}: BusinessProfileSettingsProps) {
  const initialFormData = getInitialFormData(profile);

  const [formData, setFormData] =
    useState<BusinessProfileFormData>(initialFormData);

  const [isPending, startTransition] = useTransition();

  const hasChanges =
    JSON.stringify(formData) !== JSON.stringify(initialFormData);

  const handleChange = (
    field: keyof BusinessProfileFormData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      const result = await updateBusinessProfile(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  };

  return (
    <div className="space-y-6">
      {/* Business information */}
      <Card className="rounded-3xl">
        <CardHeader>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Business information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage the business details that appear on your invoices.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Business name */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="business-name">Business name</Label>

              <Input
                id="business-name"
                value={formData.businessName}
                onChange={(event) =>
                  handleChange('businessName', event.target.value)
                }
                placeholder="Your business name"
                disabled={isPending}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="business-email">Business email</Label>

              <Input
                id="business-email"
                type="email"
                value={formData.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="business@example.com"
                disabled={isPending}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="business-phone">Phone</Label>

              <Input
                id="business-phone"
                type="tel"
                value={formData.phone}
                onChange={(event) => handleChange('phone', event.target.value)}
                placeholder="+91 98765 43210"
                disabled={isPending}
              />
            </div>

            {/* Website */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="business-website">Website</Label>

              <Input
                id="business-website"
                type="url"
                value={formData.website}
                onChange={(event) =>
                  handleChange('website', event.target.value)
                }
                placeholder="https://example.com"
                disabled={isPending}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business address */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Business address
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter the address that should appear on your invoices.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="business-address">Address</Label>

            <Input
              id="business-address"
              value={formData.address}
              onChange={(event) => handleChange('address', event.target.value)}
              placeholder="Street address"
              disabled={isPending}
            />
          </div>

          {/* City / State / Country / Postal code */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="business-city">City</Label>

              <Input
                id="business-city"
                value={formData.city}
                onChange={(event) => handleChange('city', event.target.value)}
                placeholder="Jaipur"
                disabled={isPending}
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="business-state">State</Label>

              <Input
                id="business-state"
                value={formData.state}
                onChange={(event) => handleChange('state', event.target.value)}
                placeholder="Rajasthan"
                disabled={isPending}
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="business-country">Country</Label>

              <Input
                id="business-country"
                value={formData.country}
                onChange={(event) =>
                  handleChange('country', event.target.value)
                }
                placeholder="India"
                disabled={isPending}
              />
            </div>

            {/* Postal code */}
            <div className="space-y-2">
              <Label htmlFor="business-postal-code">Postal code</Label>

              <Input
                id="business-postal-code"
                value={formData.postalCode}
                onChange={(event) =>
                  handleChange('postalCode', event.target.value)
                }
                placeholder="302001"
                disabled={isPending}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSaveChanges}
          disabled={isPending || !hasChanges}
          className="w-full sm:w-auto"
        >
          {isPending ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}
