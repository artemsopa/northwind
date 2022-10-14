import { PGDatabase } from 'drizzle-orm-pg';
import { customers } from '@/entities/customers';
import { employees } from '@/entities/employees';
import { orders } from '@/entities/orders';
import { suppliers } from '@/entities/suppliers';
import { products } from '@/entities/products';
import { details } from '@/entities/details';
import { metrics } from '@/entities/metrics';

export const schema = {
  customers,
  employees,
  orders,
  suppliers,
  products,
  details,
  metrics,
};

export type Database = PGDatabase<typeof schema>;
