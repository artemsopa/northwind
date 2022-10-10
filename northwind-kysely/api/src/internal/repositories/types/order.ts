import { Detail } from './detail';

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

export type OrderWithDetail = Order & Omit<Detail, 'id'>

export type OrderWithDetailAndProduct = Order & {
  order_id: string;
  unit_price: number;
  quantity: number;
  discount: number;
  p_id: string;
  p_name:string;
}
