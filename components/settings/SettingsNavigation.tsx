import Link from 'next/link';
import {
  Building2,
  ChevronRight,
  FileText,
  User,
  WalletCards,
} from 'lucide-react';

import { Card } from '@/components/ui/card';

const settingsItems = [
  {
    id: 'account',
    title: 'Account',
    description: 'Manage your personal information and account security.',
    href: '/settings/account',
    icon: User,
  },
  {
    id: 'business_profile',
    title: 'Business Profile',
    description: 'Manage the business information used on your invoices.',
    href: '/settings/business-profile',
    icon: Building2,
  },
  {
    id: 'invoicing',
    title: 'Invoicing',
    description: 'Manage your invoice defaults and preferences.',
    href: '/settings/invoicing',
    icon: FileText,
  },
  {
    id: 'payment_methods',
    title: 'Payment Methods',
    description: 'Manage the payment methods shown on your invoices.',
    href: '/settings/payment-methods',
    icon: WalletCards,
  },
];

export function SettingsNavigation() {
  return (
    <div className="space-y-3">
      {settingsItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link key={item.id} href={item.href} className="block">
            <Card className="rounded-2xl transition-colors hover:bg-accent/50">
              <div className="flex items-center gap-4 p-4">
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
