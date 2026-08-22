import { Shell } from '@/components/layout/Shell';
import { requireAuthentication } from '@/lib/authentication/requireAuthentication';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthentication();

  return (
    <div className="min-h-screen bg-background">
      <Shell>{children}</Shell>
    </div>
  );
}
