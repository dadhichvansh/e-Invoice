'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { LogoutButton } from '@/components/authentication/LogoutButton';
import { Navigation } from './Navigation';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation"
        className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
      >
        <Menu className="size-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-foreground/20"
          />

          {/* Navigation Drawer */}
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-border bg-card shadow-lg">
            {/* Drawer Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
              <span className="text-lg font-semibold tracking-tight text-foreground">
                e-Invoice
              </span>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation"
                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Navigation */}
            <div
              className="min-h-0 flex-1 overflow-y-auto"
              onClick={() => setIsOpen(false)}
            >
              <Navigation />
            </div>

            {/* Logout */}
            <div className="shrink-0 border-t border-border p-3">
              <LogoutButton />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
