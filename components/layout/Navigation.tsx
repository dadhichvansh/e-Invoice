'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, LayoutDashboard, Settings, Users } from 'lucide-react';

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    label: 'Invoices',
    href: '/invoices',
    icon: FileText,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface NavigationProps {
  collapsed?: boolean;
}

export function Navigation({ collapsed = false }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="px-1.5 py-4">
      <ul className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center rounded-2xl py-2.5 text-sm font-medium transition-[gap,padding,background-color,color] duration-500 ease-in-out ${
                  collapsed ? 'justify-center gap-0 px-2.5' : 'gap-3 px-3'
                } ${
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="size-4 shrink-0" />

                <span
                  className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-400 ease-in-out ${
                    collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
