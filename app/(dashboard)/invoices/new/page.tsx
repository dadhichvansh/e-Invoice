import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { InvoiceForm } from '@/components/invoices/InvoiceForm';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

export default async function NewInvoicePage() {
  const { user } = await requireAuthentication();

  const [clients, categories, paymentMethods, settings, currencies] =
    await Promise.all([
      prisma.client.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          name: 'asc',
        },
      }),

      prisma.invoiceCategory.findMany({
        where: {
          userId: user.id,
          isActive: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),

      prisma.paymentMethod.findMany({
        where: {
          userId: user.id,
        },
        orderBy: [
          {
            isDefault: 'desc',
          },
          {
            name: 'asc',
          },
        ],
      }),

      prisma.invoicingSettings.findUnique({
        where: {
          userId: user.id,
        },
      }),

      prisma.currency.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

  return (
    <main className="p-9">
      <div className="w-full space-y-5">
        <Link
          href="/invoices"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Back to Invoices
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            New Invoice
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a new invoice for your client.
          </p>
        </div>

        <InvoiceForm
          clients={clients}
          categories={categories}
          paymentMethods={paymentMethods}
          currencies={currencies}
          defaultCurrency={settings?.defaultCurrency ?? ''}
          defaultPaymentTerms={settings?.defaultPaymentTerms ?? 7}
          defaultNotes={settings?.defaultNotes ?? ''}
        />
      </div>
    </main>
  );
}
