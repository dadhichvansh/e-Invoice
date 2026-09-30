import { AlertCircle, CircleDollarSign, WalletCards } from 'lucide-react';

type DashboardFinancialStatsData = {
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

type DashboardFinancialStatsProps = {
  stats: DashboardFinancialStatsData;
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

export function DashboardFinancialStats({
  stats,
}: DashboardFinancialStatsProps) {
  const statCards = [
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
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border bg-card">
      <div className="border-b px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">
          Financial Overview
        </h2>

        <p className="mt-0.5 text-xs text-muted-foreground">
          A summary of your invoice finances
        </p>
      </div>

      <div className="grid flex-1 grid-rows-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 border-b px-5 py-4 last:border-b-0"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-4 text-primary" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>

                <p className="mt-1 truncate text-lg font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
