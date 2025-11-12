import { apiRequest } from "./api";
import { ListResponse, Product, CreateProduct, DetailResponse, UpdateProduct } from "@/lib/types";

export const apiProducts = {
  // List
  getProducts: async (params?: {
    keyword?: string;
    sort?: string;
  }): Promise<ListResponse<Product>> => {
    const query = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    return apiRequest<ListResponse<Product>>(`/products${query}`);
  },
  // Detail
  getProductById: (id: string) =>
    apiRequest<DetailResponse<Product>>(`/products/${id}`),
  // Create
  createProduct: (data: CreateProduct) =>
    apiRequest<any>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // Update
  updateProduct: (id: number, data: UpdateProduct) =>
    apiRequest<any>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  // Delete
  deleteProduct: (id: number) => apiRequest<any>(`/products/${id}`, {
    method: "DELETE"
  })
};
