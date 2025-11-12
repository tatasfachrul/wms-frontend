import { Login } from "@/lib/types/auth";
import { apiRequest } from "./api";
import { DetailResponse, ListResponse, Product } from "@/lib/types";

export const apiAuth = {
  login: (email: string, password: string) =>
    apiRequest<DetailResponse<Login>>("/auth/login", {
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

export const getRoles = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("roles");
}

export const setRoles = (roles: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("roles", roles);
  }
};

export const clearAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};
