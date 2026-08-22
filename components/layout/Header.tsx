import { PanelLeft, PanelLeftClose } from 'lucide-react';

import { ThemeSelector } from '../ui/theme-selector';
import { MobileNavigation } from './MobileNavigation';
import { UserMenu } from './UserMenu';

interface HeaderUser {
  id: string;
  name: string;
  email: string;
}

interface HeaderProps {
  title: string;
  user: HeaderUser;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Header({
  title,
  user,
  sidebarCollapsed,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-3 sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNavigation />

        {/* Desktop Sidebar Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none md:inline-flex"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </button>

        <h1 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <ThemeSelector />

        <UserMenu name={user.name} email={user.email} />
      </div>
    </header>
  );
}
