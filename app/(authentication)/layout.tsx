import { requireGuest } from '@/lib/authentication/requireGuest';

export default async function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireGuest();

  return children;
}
