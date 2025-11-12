import { apiRequest } from "./api";
import { ListResponse, Product } from "@/lib/types";

export const apiTransactions = {
  getTransactions: (params?: { product_id?: string }) => {
    const query = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    return apiRequest<any[]>(`/transactions${query}`);
  },

  createTransaction: (data: any) =>
    apiRequest<any>("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};