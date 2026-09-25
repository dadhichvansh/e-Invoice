import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { PaymentMethodsSettings } from '@/components/settings/payment-methods/PaymentMethodsSettings';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

export default async function PaymentMethodsPage() {
  const { user } = await requireAuthentication();

  const paymentMethods = await prisma.paymentMethod.findMany({
    where: {
      userId: user.id,
    },
    orderBy: [
      {
        isDefault: 'desc',
      },
      {
        createdAt: 'asc',
      },
    ],
  });

  return (
    <main className="p-4 sm:p-6 lg:p-9">
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
            Payment Methods
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the payment methods shown on your invoices.
          </p>
        </div>

        <PaymentMethodsSettings paymentMethods={paymentMethods} />
      </div>
    </main>
  );
}
