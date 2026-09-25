import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { AccountSettings } from '@/components/settings/account/AccountSettings';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';

export default async function AccountSettingsPage() {
  const { user } = await requireAuthentication();

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
            Account
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal account information and security.
          </p>
        </div>

        <AccountSettings name={user.name} email={user.email} />
      </div>
    </main>
  );
}
