export type Order = {
  id: string;
  order_date: Date;
  required_date: Date;
  shipped_date: Date | null;
  ship_via: number;
  freight: number;
  ship_name: string;
  ship_city: string;
  ship_region: string | null;
  ship_postal_code: string | null;
  ship_country: string;
  customer_id: string;
  employee_id: string;
}

export type OrderWithDetail = {
  id: string;
  shipped_date: Date;
  ship_name: string;
  ship_city: string;
  ship_country: string;
  products: number;
  quantity: number;
  sum: number;
}

export type OrderWithDetailAndProduct = Order & {
  od_uprice: number;
  od_quantity: number;
  od_discount: number;
  p_id: string;
  p_name:string;
}
