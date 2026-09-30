import { OverviewHeader } from '@/components/dashboard/OverviewHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RevenueOverview } from '@/components/dashboard/RevenueOverview';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';

import { getDashboardData } from '@/actions/dashboard/getDashboardData';
import { DashboardFinancialStats } from '@/components/dashboard/DashboardFinancialStats';

export default async function DashboardPage() {
  const dashboardResult = await getDashboardData();

  if (!dashboardResult.success) {
    return null;
  }

  const { recentInvoices, stats, revenue } = dashboardResult.data;

  return (
    <main className="p-4 sm:p-6 lg:p-9">
      <div className="space-y-5">
        <OverviewHeader />
        <DashboardStats stats={stats} />

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RevenueOverview revenue={revenue} />
          </div>

          <div className="lg:col-span-4">
            <DashboardFinancialStats
              stats={{
                revenue: stats.revenue,
                outstanding: stats.outstanding,
                overdue: stats.overdue,
              }}
            />
          </div>
        </div>

        <RecentInvoices invoices={recentInvoices} />
      </div>
    </main>
  );
}
