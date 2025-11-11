const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const clearAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: any }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      requiresAuth: false,
    }),

  getDashboardStats: () =>
    apiRequest<{
      totalProducts: number;
      lowStockCount: number;
      totalTransactions: number;
    }>('/dashboard/stats'),

  getProducts: (params?: { search?: string; sort?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest<any[]>(`/products${query}`);
  },

  getProductById: (id: string) =>
    apiRequest<any>(`/products/${id}`),

  createProduct: (data: any) =>
    apiRequest<any>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: any) =>
    apiRequest<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getTransactions: (params?: { product_id?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest<any[]>(`/transactions${query}`);
  },

  createTransaction: (data: any) =>
    apiRequest<any>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
