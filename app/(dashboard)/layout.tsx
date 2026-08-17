import { requireAuthentication } from '@/lib/authentication/requireAuthentication';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthentication();

  return <div className="min-h-screen bg-background">{children}</div>;
}
