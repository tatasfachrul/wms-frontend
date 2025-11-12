import { apiRequest } from "./api";
import { ListResponse, Product } from "@/lib/types";

export const apiDashboards = {
  getDashboardStats: () =>
    apiRequest<{
      totalProducts: number;
      lowStockCount: number;
      totalTransactions: number;
    }>("/dashboard/stats"),
};