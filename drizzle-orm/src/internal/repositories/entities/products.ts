import {
  pgTable, varchar, integer, InferModel, doublePrecision,
} from 'drizzle-orm-pg';
import { suppliers } from '@/internal/repositories/entities/suppliers';

export const products = pgTable('products', {
  id: varchar('id').primaryKey().notNull(),
  name: varchar('name').notNull(),
  quantityPerUnit: varchar('qt_per_unit').notNull(),
  unitPrice: doublePrecision('unit_price').notNull(),
  unitsInStock: integer('units_in_stock').notNull(),
  unitsOnOrder: integer('units_on_order').notNull(),
  reorderLevel: integer('reorder_level').notNull(),
  discontinued: integer('discontinued').notNull(),

  supplierId: varchar('supplier_id').notNull()
    .references(() => suppliers.id, { onDelete: 'cascade' }),
});

export type Product = InferModel<typeof products>;
