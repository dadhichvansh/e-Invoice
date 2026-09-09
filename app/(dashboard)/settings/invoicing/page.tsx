import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { InvoicingSettings } from '@/components/settings/invoicing/InvoicingSettings';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

export default async function InvoicingSettingsPage() {
  const { user } = await requireAuthentication();

  const [settings, categories] = await Promise.all([
    prisma.invoicingSettings.findUnique({
      where: {
        userId: user.id,
      },
    }),

    prisma.invoiceCategory.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    }),
  ]);

  return (
    <main className="p-9">
      <div className="w-full space-y-5">
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Back to Settings
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Invoicing
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Configure your invoice defaults, categories, and payment terms.
          </p>
        </div>

        <InvoicingSettings settings={settings} categories={categories} />
      </div>
    </main>
  );
}
