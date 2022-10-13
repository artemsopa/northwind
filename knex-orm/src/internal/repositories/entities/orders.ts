import {
  pgTable, varchar, date, integer, doublePrecision, InferModel,
} from 'drizzle-orm-pg';
import { customers } from '@/internal/repositories/entities/customers';
import { employees } from './employees';

export const orders = pgTable('orders', {
  id: varchar('id').primaryKey().notNull(),
  orderDate: date('order_date', { mode: 'date' }).notNull(),
  requiredDate: date('required_date', { mode: 'date' }).notNull(),
  shippedDate: date('shipped_date', { mode: 'date' }),
  shipVia: integer('ship_via').notNull(),
  freight: doublePrecision('freight').notNull(),
  shipName: varchar('ship_name').notNull(),
  shipCity: varchar('ship_city').notNull(),
  shipRegion: varchar('ship_region'),
  shipPostalCode: varchar('ship_postal_code'),
  shipCountry: varchar('ship_country').notNull(),

  customerId: varchar('customer_id').notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),

  employeeId: varchar('employee_id').notNull()
    .references(() => employees.id, { onDelete: 'cascade' }),
});

export type Order = InferModel<typeof orders>;
