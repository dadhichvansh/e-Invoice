'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { logout } from '@/actions/authentication/logout';

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logout();

      if (result.success) {
        toast.success(result.message);
        router.replace('/login');
        return;
      }

      toast.error(result.message);
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="..."
    >
      {isPending ? 'Signing out...' : 'Sign out'}
    </button>
  );
}
