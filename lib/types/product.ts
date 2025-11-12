export interface Product {
  id: number;
  stock: number;
  minimum_stock: number;
  name: string;
  sku: string;
  shelf_location: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateProduct {
  name: string;
  sku: string;
  stock: number;
  shelf_location?: string;
  minimum_stock: number;
}

export interface UpdateProduct {
  id: number;
  name: string;
  sku: string;
  stock: number;
  shelf_location?: string;
  minimum_stock: number;
}
