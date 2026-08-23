'use client';

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

const revenueData = [
  { month: 'Mar', revenue: 0 },
  { month: 'Apr', revenue: 4200 },
  { month: 'May', revenue: 7800 },
  { month: 'Jun', revenue: 12400 },
  { month: 'Jul', revenue: 28600 },
  { month: 'Aug', revenue: 34569 },
];

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function RevenueOverview() {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>

        <CardDescription>Last 6 months · Paid invoices</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <AreaChart
            data={revenueData}
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
              width={45}
              tickFormatter={(value) =>
                value === 0 ? '0' : `${value / 1000}k`
              }
            />

            <ChartTooltip
              cursor={{
                strokeDasharray: '4 4',
              }}
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(Number(value))}
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
      </CardContent>
    </Card>
  );
}
