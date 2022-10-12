import { PGDatabase } from 'drizzle-orm-pg';
import { customers } from '@/internal/repositories/entities/customers';
import { employees } from '@/internal/repositories/entities/employees';
import { orders } from '@/internal/repositories/entities/orders';
import { suppliers } from '@/internal/repositories/entities/suppliers';
import { products } from '@/internal/repositories/entities/products';
import { details } from '@/internal/repositories/entities/details';
import { metrics } from '@/internal/repositories/entities/metrics';

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
