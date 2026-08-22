import Link from 'next/link';
import { Sparkles } from 'lucide-react';

import { LogoutButton } from '@/components/authentication/logout/LogoutButton';
import { Navigation } from './Navigation';

export function Sidebar() {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-foreground">
              e-Invoice
            </p>

            <p className="mt-0.5 text-xs leading-tight text-muted-foreground">
              Freelance invoicing
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Navigation />
      </div>

      {/* Logout */}
      <div className="shrink-0 border-t border-border p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
