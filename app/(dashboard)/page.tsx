import { OverviewHeader } from '@/components/dashboard/OverviewHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RevenueOverview } from '@/components/dashboard/RevenueOverview';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';

export default function DashboardPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-9">
      <div className="space-y-5">
        <OverviewHeader />
        <DashboardStats />
        <RevenueOverview />
        <RecentInvoices />
      </div>
    </main>
  );
}
