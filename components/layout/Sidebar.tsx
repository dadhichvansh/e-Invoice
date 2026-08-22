'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

import { LogoutButton } from '@/components/authentication/LogoutButton';
import { Navigation } from './Navigation';

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  return (
    <aside
      className={`hidden h-full shrink-0 flex-col border-r border-border bg-card md:flex ${
        collapsed ? 'w-18' : 'w-64'
      } transition-[width] duration-500 ease-in-out`}
    >
      {/* Brand */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-border transition-[padding] duration-500 ease-in-out ${
          collapsed ? 'justify-center px-2' : 'px-4'
        }`}
      >
        <Link
          href="/"
          title={collapsed ? 'e-Invoice' : undefined}
          className={`flex min-w-0 items-center transition-[gap] duration-500 ease-in-out ${
            collapsed ? 'justify-center gap-0' : 'gap-3'
          }`}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>

          <div
            className={`min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-400 ease-in-out ${
              collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'
            }`}
          >
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
        <Navigation collapsed={collapsed} />
      </div>

      {/* Logout */}
      <div
        className={`shrink-0 border-t border-border transition-[padding] duration-500 ease-in-out ${
          collapsed ? 'p-2' : 'p-2'
        }`}
      >
        <LogoutButton collapsed={collapsed} />
      </div>
    </aside>
  );
}
