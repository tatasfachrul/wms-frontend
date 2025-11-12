import { apiRequest } from "./api";
import { ListResponse, Transaction } from "@/lib/types";

export const apiTransactions = {
  getTransactions: (params?: { page?: number, perPage?: number }) => {
    const query = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    return apiRequest<ListResponse<Transaction>>(`/transactions${query}`);
  },

  createTransaction: (data: any) =>
    apiRequest<any>("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};