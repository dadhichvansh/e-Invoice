import { LogoutButton } from '@/components/authentication/logout/LogoutButton';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">Welcome to e-Invoice.</p>

          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
