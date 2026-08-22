'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

import { logout } from '@/actions/authentication/logout';
import { Button } from '@/components/ui/button';

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
    <Button
      type="button"
      variant="ghost"
      onClick={handleLogout}
      disabled={isPending}
      className="h-10 w-full justify-start gap-3 rounded-2xl border-0 px-3 text-sm font-medium text-muted-foreground shadow-none hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring"
    >
      <LogOut className="size-4 shrink-0" />

      <span>{isPending ? 'Logging out...' : 'Logout'}</span>
    </Button>
  );
}
