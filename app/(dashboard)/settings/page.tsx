import { SettingsNavigation } from '@/components/settings/SettingsNavigation';

export default async function SettingsPage() {
  return (
    <main className="p-9">
      <div className="w-full space-y-7">
        {/* Settings header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account and application preferences.
          </p>
        </div>

        {/* Settings navigation */}
        <SettingsNavigation />
      </div>
    </main>
  );
}
