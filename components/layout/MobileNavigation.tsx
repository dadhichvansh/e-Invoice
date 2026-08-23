'use client';

import { useState } from 'react';
import { Menu, PanelLeft, Sparkles, X } from 'lucide-react';

import { LogoutButton } from '@/components/authentication/LogoutButton';
import { Navigation } from './Navigation';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation"
        aria-expanded={isOpen}
        className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none md:hidden cursor-pointer"
      >
        <PanelLeft className="size-4" />
      </button>

      {/* Mobile navigation drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        {/* Overlay */}
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/80 transition-opacity duration-300 ease-out ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Drawer */}
        <aside
          className={`relative flex h-full w-72 max-w-[85vw] flex-col border-r border-border bg-card shadow-lg transition-transform duration-500 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>

            <div
              className={
                'min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-400 ease-in-out max-w-40 opacity-100'
              }
            >
              <p className="truncate text-sm font-semibold leading-tight text-foreground">
                e-Invoice
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Freelance invoicing
              </p>
            </div>
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
      </div>
    </>
  );
}
