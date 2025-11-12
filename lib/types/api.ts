export interface Meta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ListResponse<T> {
  success: boolean;
  data: T[];
  meta: Meta;
}

export interface DetailResponse<T> {
  success: boolean;
  data: T;
}
