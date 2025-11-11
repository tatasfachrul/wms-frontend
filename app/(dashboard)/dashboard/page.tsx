'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import SummaryCard from '@/components/common/SummaryCard';
import { Package, AlertTriangle, FileText } from 'lucide-react';
import Toast from '@/components/common/Toast';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    totalTransactions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to load dashboard stats', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your warehouse management system</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard
              title="Total Products"
              value={stats.totalProducts}
              icon={Package}
            />
            <SummaryCard
              title="Low Stock Items"
              value={stats.lowStockCount}
              icon={AlertTriangle}
              variant="warning"
            />
            <SummaryCard
              title="Total Transactions"
              value={stats.totalTransactions}
              icon={FileText}
            />
          </div>
        )}
      </div>
    </>
  );
}
