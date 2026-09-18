'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { clientSchema, type ClientInput } from '@/lib/validators/client';

import { createClient } from '@/actions/clients/createClient';
import { updateClient } from '@/actions/clients/updateClient';

type FormErrors = Partial<Record<keyof ClientInput, string>>;

type ClientFormProps = {
  client?: {
    id: string;
    slug: string;
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
    website: string | null;
    notes: string | null;
  };
};

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ClientInput>(() => ({
    name: client?.name ?? '',
    email: client?.email ?? '',
    company: client?.company ?? '',
    phone: client?.phone ?? '',
    address: client?.address ?? '',
    city: client?.city ?? '',
    state: client?.state ?? '',
    postalCode: client?.postalCode ?? '',
    country: client?.country ?? '',
    website: client?.website ?? '',
    notes: client?.notes ?? '',
  }));

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof ClientInput, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = clientSchema.safeParse(formData);

    if (!result.success) {
      const validationErrors: FormErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ClientInput;

        if (!validationErrors[field]) {
          validationErrors[field] = issue.message;
        }
      }

      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = client
        ? await updateClient(client.id, result.data)
        : await createClient(result.data);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/clients');
      router.refresh();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client details</CardTitle>
        <CardDescription>
          {client
            ? 'Update the contact and business details for this client.'
            : 'Enter the contact and business details for this client.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>

              <Input
                id="name"
                value={formData.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="John Doe"
                disabled={isSubmitting}
              />

              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>

              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="john@example.com"
                disabled={isSubmitting}
              />

              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>

              <Input
                id="company"
                value={formData.company ?? ''}
                onChange={(event) =>
                  handleChange('company', event.target.value)
                }
                placeholder="Acme Inc."
                disabled={isSubmitting}
              />

              {errors.company && (
                <p className="text-sm text-destructive">{errors.company}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>

              <Input
                id="phone"
                type="tel"
                value={formData.phone ?? ''}
                onChange={(event) => handleChange('phone', event.target.value)}
                placeholder="+91 98765 43210"
                disabled={isSubmitting}
              />

              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>

            <Input
              id="address"
              value={formData.address ?? ''}
              onChange={(event) => handleChange('address', event.target.value)}
              placeholder="123 Main Street"
              disabled={isSubmitting}
            />

            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>

              <Input
                id="city"
                value={formData.city ?? ''}
                onChange={(event) => handleChange('city', event.target.value)}
                placeholder="Jaipur"
                disabled={isSubmitting}
              />

              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>

              <Input
                id="state"
                value={formData.state ?? ''}
                onChange={(event) => handleChange('state', event.target.value)}
                placeholder="Rajasthan"
                disabled={isSubmitting}
              />

              {errors.state && (
                <p className="text-sm text-destructive">{errors.state}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal code</Label>

              <Input
                id="postalCode"
                value={formData.postalCode ?? ''}
                onChange={(event) =>
                  handleChange('postalCode', event.target.value)
                }
                placeholder="302001"
                disabled={isSubmitting}
              />

              {errors.postalCode && (
                <p className="text-sm text-destructive">{errors.postalCode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>

              <Input
                id="country"
                value={formData.country ?? ''}
                onChange={(event) =>
                  handleChange('country', event.target.value)
                }
                placeholder="India"
                disabled={isSubmitting}
              />

              {errors.country && (
                <p className="text-sm text-destructive">{errors.country}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>

            <Input
              id="website"
              type="url"
              value={formData.website ?? ''}
              onChange={(event) => handleChange('website', event.target.value)}
              placeholder="https://example.com"
              disabled={isSubmitting}
            />

            {errors.website && (
              <p className="text-sm text-destructive">{errors.website}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>

            <Textarea
              id="notes"
              value={formData.notes ?? ''}
              onChange={(event) => handleChange('notes', event.target.value)}
              placeholder="Add any additional notes about this client..."
              rows={5}
              disabled={isSubmitting}
            />

            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link href="/clients">
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? client
                  ? 'Saving...'
                  : 'Creating...'
                : client
                  ? 'Save changes'
                  : 'Create client'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
