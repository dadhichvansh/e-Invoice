'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { updateBusinessProfile } from '@/actions/settings/business-profile/updateBusinessProfile';
import { businessProfileSchema } from '@/lib/validators/businessProfile';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

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

type FieldErrors = Partial<Record<keyof BusinessProfileFormData, string>>;

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

  const [errors, setErrors] = useState<FieldErrors>({});

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

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];

      return next;
    });
  };

  const validateForm = () => {
    const result = businessProfileSchema.safeParse(formData);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: FieldErrors = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0];

      if (
        typeof field === 'string' &&
        field in formData &&
        !fieldErrors[field as keyof BusinessProfileFormData]
      ) {
        fieldErrors[field as keyof BusinessProfileFormData] = issue.message;
      }
    }

    setErrors(fieldErrors);

    return false;
  };

  const handleSaveChanges = () => {
    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      const result = await updateBusinessProfile(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setErrors({});
      toast.success(result.message);
    });
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Business Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Enter the business details that should appear on your invoices.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Business information */}
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">
              Business details
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Provide your business name and contact information.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
                aria-invalid={Boolean(errors.businessName)}
                aria-describedby={
                  errors.businessName ? 'business-name-error' : undefined
                }
              />

              {errors.businessName && (
                <p
                  id="business-name-error"
                  className="text-sm text-destructive"
                >
                  {errors.businessName}
                </p>
              )}
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
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? 'business-email-error' : undefined
                }
              />

              {errors.email && (
                <p
                  id="business-email-error"
                  className="text-sm text-destructive"
                >
                  {errors.email}
                </p>
              )}
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
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={
                  errors.phone ? 'business-phone-error' : undefined
                }
              />

              {errors.phone && (
                <p
                  id="business-phone-error"
                  className="text-sm text-destructive"
                >
                  {errors.phone}
                </p>
              )}
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
                aria-invalid={Boolean(errors.website)}
                aria-describedby={
                  errors.website ? 'business-website-error' : undefined
                }
              />

              {errors.website && (
                <p
                  id="business-website-error"
                  className="text-sm text-destructive"
                >
                  {errors.website}
                </p>
              )}
            </div>
          </div>
        </section>

        <Separator />

        {/* Business address */}
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">
              Business address
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter the address that should appear on your invoices.
            </p>
          </div>

          <div className="space-y-4">
            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="business-address">Address</Label>

              <Input
                id="business-address"
                value={formData.address}
                onChange={(event) =>
                  handleChange('address', event.target.value)
                }
                placeholder="Street address"
                disabled={isPending}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={
                  errors.address ? 'business-address-error' : undefined
                }
              />

              {errors.address && (
                <p
                  id="business-address-error"
                  className="text-sm text-destructive"
                >
                  {errors.address}
                </p>
              )}
            </div>

            {/* City / State / Country / Postal code */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="business-city">City</Label>

                <Input
                  id="business-city"
                  value={formData.city}
                  onChange={(event) => handleChange('city', event.target.value)}
                  placeholder="Jaipur"
                  disabled={isPending}
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={
                    errors.city ? 'business-city-error' : undefined
                  }
                />

                {errors.city && (
                  <p
                    id="business-city-error"
                    className="text-sm text-destructive"
                  >
                    {errors.city}
                  </p>
                )}
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="business-state">State</Label>

                <Input
                  id="business-state"
                  value={formData.state}
                  onChange={(event) =>
                    handleChange('state', event.target.value)
                  }
                  placeholder="Rajasthan"
                  disabled={isPending}
                  aria-invalid={Boolean(errors.state)}
                  aria-describedby={
                    errors.state ? 'business-state-error' : undefined
                  }
                />

                {errors.state && (
                  <p
                    id="business-state-error"
                    className="text-sm text-destructive"
                  >
                    {errors.state}
                  </p>
                )}
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
                  aria-invalid={Boolean(errors.country)}
                  aria-describedby={
                    errors.country ? 'business-country-error' : undefined
                  }
                />

                {errors.country && (
                  <p
                    id="business-country-error"
                    className="text-sm text-destructive"
                  >
                    {errors.country}
                  </p>
                )}
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
                  aria-invalid={Boolean(errors.postalCode)}
                  aria-describedby={
                    errors.postalCode ? 'business-postal-code-error' : undefined
                  }
                />

                {errors.postalCode && (
                  <p
                    id="business-postal-code-error"
                    className="text-sm text-destructive"
                  >
                    {errors.postalCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

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
      </CardContent>
    </Card>
  );
}
