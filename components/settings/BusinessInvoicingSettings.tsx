import Link from 'next/link';
import { Building2, ChevronRight, WalletCards } from 'lucide-react';

import { Card } from '@/components/ui/card';

const settingsItems = [
  {
    title: 'Business Profile',
    description: 'Manage your business information and invoice details.',
    href: '/settings/business-profile',
    icon: Building2,
  },
  {
    title: 'Payment Methods',
    description: 'Manage the payment methods shown on your invoices.',
    href: '/settings/payment-methods',
    icon: WalletCards,
  },
];

export function BusinessInvoicingSettings() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Business & Invoicing
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your business information and payment preferences.
        </p>
      </div>

      {settingsItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href} className="block">
            <Card className="rounded-2xl transition-colors hover:bg-accent/50">
              <div className="flex items-center gap-4 p-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Icon className="size-5 text-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
