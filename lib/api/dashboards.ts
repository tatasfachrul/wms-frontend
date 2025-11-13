import { DashboardChart, DashboardSummary } from "../types/dashboard";
import { apiRequest } from "./api";
import { DetailResponse, Product } from "@/lib/types";

export const apiDashboards = {
  getDashboardStats: () =>
    apiRequest<DetailResponse<DashboardSummary>>("/dashboard"),

  getTransactionStats: async ({
    period,
  }: {
    period: "daily" | "weekly" | "monthly";
  }) =>
    await apiRequest<DetailResponse<DashboardChart>>(
      `/dashboard/transactions?type=${period}`
    ),
};