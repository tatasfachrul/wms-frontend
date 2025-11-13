"use client";

import { useEffect, useMemo, useState } from "react";
import { apiDashboards } from "@/lib/api";
import SummaryCard from "@/components/common/SummaryCard";
import { Package, AlertTriangle, FileText } from "lucide-react";
import Toast from "@/components/common/Toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChartDashboard } from "@/components/layout/Dashboard/ChartDashboard";
import { DashboardChart, DashboardSummary } from "@/lib/types/dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardSummary>({
    totalProducts: 0,
    lowStockItems: [],
    totalTransactions: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Chart Section
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [loadingChart, setLoadingChart] = useState(true);
  const [chartData, setChartData] = useState<DashboardChart>({
    labels: [],
    inboundStock: [],
    outboundStock: [],
  });

  useEffect(() => {
    fetchSummary();
    fetchChart(period);
  }, []);

  useEffect(() => {
    fetchChart(period);
  }, [period]);

  // Fetch Dashboard Summary
  async function fetchSummary() {
    try {
      setLoadingStats(true);
      const data = await apiDashboards.getDashboardStats();
      setStats(data.data);
    } catch (err: any) {
      setToast({
        message: err.message || "Failed to load stats",
        type: "error",
      });
    } finally {
      setLoadingStats(false);
    }
  }

  // Fetch Dashboard Chart
  async function fetchChart(p: "daily" | "weekly" | "monthly") {
    try {
      setLoadingChart(true);
      const data = await apiDashboards.getTransactionStats({ period: p });
      setChartData(data.data);
    } catch (err: any) {
      setToast({
        message: err.message || "Failed to load chart",
        type: "error",
      });
    } finally {
      setLoadingChart(false);
    }
  }

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
          <p className="text-gray-600 mt-1">
            Welcome to your warehouse management system
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-6 border border-gray-200 animate-pulse"
              >
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
              value={stats.lowStockItems.length}
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
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Transaction Overview</h2>
            <div className="flex gap-2">
              {(["daily", "weekly", "monthly"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded ${
                    period === p ? "bg-blue-600 text-white" : "bg-white border"
                  }`}
                >
                  {p[0].toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {loadingChart ? (
            <div className="h-64 flex items-center justify-center text-sm text-gray-500">
              Loading chart…
            </div>
          ) : (
            <div className="flex">
              <ChartDashboard period={period} data={chartData} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
