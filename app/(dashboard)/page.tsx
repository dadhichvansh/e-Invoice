import { OverviewHeader } from '@/components/dashboard/OverviewHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RevenueOverview } from '@/components/dashboard/RevenueOverview';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';

import { getDashboardData } from '@/actions/dashboard/getDashboardData';

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
        <RevenueOverview revenue={revenue} />
        <RecentInvoices invoices={recentInvoices} />
      </div>
    </main>
  );
}
