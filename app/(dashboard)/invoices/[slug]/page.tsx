import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { getInvoiceBySlug } from '@/actions/invoices/getInvoiceBySlug';
import { InvoiceView } from '@/components/invoices/InvoiceView';
import { Button } from '@/components/ui/button';
import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

interface ViewInvoicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ViewInvoicePage({
  params,
}: ViewInvoicePageProps) {
  const { slug } = await params;

  const { user } = await requireAuthentication();

  const invoiceResult = await getInvoiceBySlug(slug);

  if (!invoiceResult.success) {
    return (
      <main className="p-4 sm:p-6 lg:p-9">
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

  const invoice = invoiceResult.invoice;

  const [businessProfile, currency] = await Promise.all([
    prisma.businessProfile.findUnique({
      where: {
        userId: user.id,
      },
    }),

    prisma.currency.findFirst({
      where: {
        userId: user.id,
        code: invoice.currency,
      },
      select: {
        code: true,
        name: true,
        symbol: true,
      },
    }),
  ]);

  return (
    <main className="p-4 sm:p-6 lg:p-9">
      <div className="w-full space-y-5">
        <Link
          href="/invoices"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Back to Invoices
        </Link>

        <InvoiceView
          invoice={invoice}
          businessProfile={businessProfile}
          currency={currency}
        />
      </div>
    </main>
  );
}
