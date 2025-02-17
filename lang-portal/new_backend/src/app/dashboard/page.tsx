import { getQuickStats } from '@/lib/api/dashboard';
import { QuickStats } from '@/components/dashboard/QuickStats';

export default async function DashboardPage() {
  const stats = await getQuickStats();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <QuickStats data={stats} />
    </div>
  );
} 