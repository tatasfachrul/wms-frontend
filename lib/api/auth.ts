import { apiRequest } from "./api";
import { ListResponse, Product } from "@/lib/types";

export const apiAuth = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: any }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      requiresAuth: false,
    }),
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const clearAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};
