export type Product = {
  id: string;
  name: string;
  qt_per_unit: string;
  unit_price: number;
  units_in_stock: number;
  units_on_order: number;
  reorder_level: number;
  discontinued: number;
  supplier_id: string;
}

export type ProductWithSupplier = Product & {
  s_id: string;
  s_company_name: string;
}
