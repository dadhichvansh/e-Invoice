import Link from 'next/link';
import {
  Building2,
  CalendarDays,
  Globe,
  Info,
  Mail,
  MapPin,
  Pencil,
  Phone,
  StickyNote,
  UserRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Client = {
  id: string;
  name: string;
  slug: string;
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
  createdAt: Date;
  updatedAt: Date;
};

type ClientViewProps = {
  client: Client;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 wrap-break-word text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function ClientView({ client }: ClientViewProps) {
  const addressLines = [
    client.address,
    [client.city, client.state].filter(Boolean).join(', '),
    client.postalCode,
    client.country,
  ].filter(Boolean);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {client.name}
            </h1>

            {client.company && (
              <p className="mt-1 text-sm text-muted-foreground">
                {client.company}
              </p>
            )}
          </div>
        </div>

        <Link href={`/clients/${client.slug}/edit`}>
          <Button variant="outline">
            <Pencil className="size-4" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Contact Information */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserRound className="size-4 text-primary" />
            Contact Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-3 md:grid-cols-2">
          <DetailItem icon={Mail} label="Email" value={client.email} />

          <DetailItem icon={Phone} label="Phone" value={client.phone} />

          <DetailItem icon={Building2} label="Company" value={client.company} />

          {client.website && (
            <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Globe className="size-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Website
                </p>

                <a
                  href={
                    client.website.startsWith('http')
                      ? client.website
                      : `https://${client.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-sm text-primary hover:underline"
                >
                  {client.website}
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address and Notes */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Address */}
        <Card className="h-full rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4 text-primary" />
              Address
            </CardTitle>
          </CardHeader>

          <CardContent>
            {addressLines.length > 0 ? (
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm leading-6 text-foreground">
                  {addressLines.map((line, index) => (
                    <span key={`${line}-${index}`} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            ) : (
              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">
                  No address information available.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="h-full rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <StickyNote className="size-4 text-primary" />
              Notes
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border bg-muted/20 p-4">
              {client.notes ? (
                <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                  {client.notes}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No notes available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="size-4 text-primary" />
            Client Meta
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/60 text-muted-foreground">
                <CalendarDays className="size-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Created
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatDate(client.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/60 text-muted-foreground">
                <CalendarDays className="size-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Last Updated
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatDate(client.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
