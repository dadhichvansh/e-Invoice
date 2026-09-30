import { CheckCircle2, Clock3, FileText, Users } from 'lucide-react';

import { StatCard } from './StatCard';

type DashboardStatsData = {
  clients: number;
  invoices: number;
  pending: number;
  paid: number;
};

type DashboardStatsProps = {
  stats: DashboardStatsData;
};

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
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
