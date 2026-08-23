import {
  AlertCircle,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  Users,
  WalletCards,
} from 'lucide-react';

import { StatCard } from './StatCard';

const stats = [
  {
    label: 'Clients',
    value: 12,
    description: 'Active clients',
    icon: Users,
  },
  {
    label: 'Invoices',
    value: 28,
    description: 'Total invoices',
    icon: FileText,
  },
  {
    label: 'Pending',
    value: 4,
    description: 'Awaiting payment',
    icon: Clock3,
  },
  {
    label: 'Paid',
    value: 24,
    description: 'Invoices paid',
    icon: CheckCircle2,
  },
  {
    label: 'Revenue',
    value: '₹1,24,500.00',
    description: 'Paid invoices',
    icon: CircleDollarSign,
  },
  {
    label: 'Outstanding',
    value: '₹32,000.00',
    description: 'Amount yet to be paid',
    icon: WalletCards,
  },
  {
    label: 'Overdue',
    value: 2,
    description: 'Past due date',
    icon: AlertCircle,
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={index < 4 ? 'lg:col-span-3' : 'lg:col-span-4'}
        >
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
}
