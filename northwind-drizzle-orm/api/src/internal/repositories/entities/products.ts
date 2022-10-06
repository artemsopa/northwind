import {
  pgTable, varchar, integer, InferModel, doublePrecision,
} from 'drizzle-orm-pg';
import { suppliers } from './suppliers';

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

export class Product implements InferModel<typeof products> {
  id: string;
  name: string;
  quantityPerUnit: string;
  unitPrice: number;
  unitsInStock: number;
  unitsOnOrder: number;
  reorderLevel: number;
  discontinued: number;
  supplierId: string;
  constructor(
    id: string,
    name: string,
    quantityPerUnit: string,
    unitPrice: number,
    unitsInStock: number,
    unitsOnOrder: number,
    reorderLevel: number,
    discontinued: number,
    supplierId: string,
  ) {
    this.id = id;
    this.name = name;
    this.quantityPerUnit = quantityPerUnit;
    this.unitPrice = unitPrice;
    this.unitsInStock = unitsInStock;
    this.unitsOnOrder = unitsOnOrder;
    this.reorderLevel = reorderLevel;
    this.discontinued = discontinued;
    this.supplierId = supplierId;
  }
}
