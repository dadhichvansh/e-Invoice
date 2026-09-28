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

type DashboardStatsData = {
  clients: number;
  invoices: number;
  pending: number;
  paid: number;
  revenue: {
    currency: string;
    symbol: string;
    amount: number;
  }[];
  outstanding: {
    currency: string;
    symbol: string;
    amount: number;
  }[];
  overdue: {
    currency: string;
    symbol: string;
    amount: number;
  }[];
};

type DashboardStatsProps = {
  stats: DashboardStatsData;
};

function formatAmount(
  amounts: {
    currency: string;
    symbol: string;
    amount: number;
  }[],
) {
  if (amounts.length === 0) {
    return '—';
  }

  return amounts
    .map(
      ({ symbol, amount }) =>
        `${symbol}${new Intl.NumberFormat('en-IN', {
          maximumFractionDigits: 2,
        }).format(amount)}`,
    )
    .join(' · ');
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      label: 'Clients',
      value: stats.clients,
      description: 'Active clients',
      icon: Users,
    },
    {
      label: 'Invoices',
      value: stats.invoices,
      description: 'Total invoices',
      icon: FileText,
    },
    {
      label: 'Pending',
      value: stats.pending,
      description: 'Awaiting payment',
      icon: Clock3,
    },
    {
      label: 'Paid',
      value: stats.paid,
      description: 'Invoices paid',
      icon: CheckCircle2,
    },
    {
      label: 'Revenue',
      value: formatAmount(stats.revenue),
      description: 'Paid invoices',
      icon: CircleDollarSign,
    },
    {
      label: 'Outstanding',
      value: formatAmount(stats.outstanding),
      description: 'Amount yet to be paid',
      icon: WalletCards,
    },
    {
      label: 'Overdue',
      value: formatAmount(stats.overdue),
      description: 'Past due amount',
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
      {statCards.map((stat, index) => (
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
