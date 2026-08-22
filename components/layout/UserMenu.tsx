'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { toast } from 'sonner';

import { logout } from '@/actions/authentication/logout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  name: string;
  email: string;
}

export function UserMenu({ name, email }: UserMenuProps) {
  const router = useRouter();
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    startLogoutTransition(async () => {
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
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted focus:outline-none"
        aria-label="Open user menu"
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="hidden text-left sm:block">
          <p className="max-w-52 truncate text-sm font-medium text-foreground">
            {email}
          </p>
        </div>

        <ChevronDown className="mr-1 hidden size-4 text-muted-foreground sm:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-60">
        <div className="px-2 py-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {name}
          </p>

          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {email}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="size-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
