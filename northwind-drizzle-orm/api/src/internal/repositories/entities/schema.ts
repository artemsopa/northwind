import { PGDatabase } from 'drizzle-orm-pg';
import { customers } from './customers';
import { employees } from './employees';
import { orders } from './orders';
import { suppliers } from './suppliers';
import { products } from './products';
import { details } from './details';
import { metrics } from './metrics';

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
