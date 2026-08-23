import { requireAuthentication } from '@/lib/authentication/requireAuthentication';

import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { BusinessInvoicingSettings } from '@/components/settings/BusinessInvoicingSettings';

export default async function SettingsPage() {
  const { user } = await requireAuthentication();

  return (
    <main className="p-9">
      <div className="w-full space-y-7">
        <SettingsHeader />
        <AccountSettings name={user.name} email={user.email} />
        <BusinessInvoicingSettings />
      </div>
    </main>
  );
}
