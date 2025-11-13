export interface DashboardSummary {
  totalProducts: number;
  lowStockItems: Array<number|string|any>;
  totalTransactions: number;
}

export interface DashboardChart {
  labels: Array<string>;
  inboundStock: Array<number>;
  outboundStock: Array<number>;
}