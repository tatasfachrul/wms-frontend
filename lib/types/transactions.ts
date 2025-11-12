export interface Transaction {
  id: number;
  product_id: number;
  quantity: number;
  product_stock: number;
  type: "IN" | "OUT";
  product_name: string;
  created_at: string; // ISO timestamp or SQL datetime format
}
