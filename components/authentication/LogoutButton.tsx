'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

import { logout } from '@/actions/authentication/logout';
import { Button } from '@/components/ui/button';

interface LogoutButtonProps {
  collapsed?: boolean;
}

export function LogoutButton({ collapsed = false }: LogoutButtonProps) {
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

  const label = isPending ? 'Logging out...' : 'Logout';

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleLogout}
      disabled={isPending}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      className={`h-10 w-full rounded-2xl border-0 text-sm font-medium text-muted-foreground shadow-none transition-[gap,padding,background-color,color] duration-300 ease-in-out hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring ${
        collapsed ? 'justify-center gap-0 px-2.5' : 'justify-start gap-3 px-3'
      }`}
    >
      <LogOut className="size-4 shrink-0" />

      <span
        className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out ${
          collapsed ? 'max-w-0 opacity-0' : 'max-w-32 opacity-100'
        }`}
      >
        {label}
      </span>
    </Button>
  );
}
