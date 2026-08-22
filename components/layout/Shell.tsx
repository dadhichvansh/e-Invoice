'use client';

import { useState } from 'react';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface ShellUser {
  id: string;
  name: string;
  email: string;
}

interface ShellProps {
  children: React.ReactNode;
  user: ShellUser;
}

export function Shell({ children, user }: ShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((previous) => !previous);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header
          title="Dashboard"
          user={user}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
