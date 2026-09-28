'use client';

import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

type RevenueData = {
  currency: string;
  symbol: string;
  data: {
    month: string;
    revenue: number;
  }[];
};

type RevenueOverviewProps = {
  revenue: RevenueData[];
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function RevenueOverview({ revenue }: RevenueOverviewProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(
    revenue[0]?.currency ?? '',
  );

  const selectedRevenue = useMemo(
    () => revenue.find((item) => item.currency === selectedCurrency),
    [revenue, selectedCurrency],
  );

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: 'var(--primary)',
    },
  } satisfies ChartConfig;

  const chartData = selectedRevenue?.data ?? [];

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Revenue</CardTitle>

          <CardDescription>Last 6 months · Paid invoices</CardDescription>
        </div>

        {revenue.length > 1 && (
          <select
            value={selectedCurrency}
            onChange={(event) => setSelectedCurrency(event.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
            aria-label="Select revenue currency"
          >
            {revenue.map((item) => (
              <option key={item.currency} value={item.currency}>
                {item.currency} ({item.symbol})
              </option>
            ))}
          </select>
        )}
      </CardHeader>

      <CardContent>
        {selectedRevenue ? (
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <AreaChart
              data={chartData}
              margin={{
                top: 8,
                right: 8,
                left: 8,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.25}
                  />

                  <stop
                    offset="100%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="4 4" />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                width={55}
                tickFormatter={(value) => {
                  if (value === 0) {
                    return '0';
                  }

                  if (value >= 1000000) {
                    return `${value / 1000000}M`;
                  }

                  if (value >= 1000) {
                    return `${value / 1000}k`;
                  }

                  return String(value);
                }}
              />

              <ChartTooltip
                cursor={{
                  strokeDasharray: '4 4',
                }}
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      formatCurrency(Number(value), selectedRevenue.currency)
                    }
                  />
                }
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                fill="url(#revenueFill)"
                dot={false}
                activeDot={{
                  r: 5,
                }}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            No paid invoice revenue in the last 6 months.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
