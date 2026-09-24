import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { getInvoiceBySlug } from '@/actions/invoices/getInvoiceBySlug';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { Button } from '@/components/ui/button';
import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

interface EditInvoicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditInvoicePage({
  params,
}: EditInvoicePageProps) {
  const { slug } = await params;

  const { user } = await requireAuthentication();

  const invoiceResult = await getInvoiceBySlug(slug);

  if (!invoiceResult.success) {
    return (
      <main className="p-9">
        <div className="w-full space-y-4">
          <Link href="/invoices">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              Back to invoices
            </Button>
          </Link>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Invoice not found
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {invoiceResult.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

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
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
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
            Edit invoice
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Update the details of invoice {invoiceResult.invoice.invoiceNumber}.
          </p>
        </div>

        <InvoiceForm
          clients={clients}
          categories={categories}
          paymentMethods={paymentMethods}
          currencies={currencies}
          defaultCurrency={
            invoiceResult.invoice.currency || settings?.defaultCurrency || ''
          }
          defaultPaymentTerms={settings?.defaultPaymentTerms ?? 30}
          defaultNotes={settings?.defaultNotes ?? ''}
          mode="edit"
          initialInvoice={invoiceResult.invoice}
        />
      </div>
    </main>
  );
}
