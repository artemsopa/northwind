import {
  pgTable, varchar, integer, doublePrecision, InferModel,
} from 'drizzle-orm-pg';
import { orders } from '@/internal/repositories/entities/orders';
import { products } from '@/internal/repositories/entities/products';

export const details = pgTable('order_details', {
  unitPrice: doublePrecision('unit_price').notNull(),
  quantity: integer('quantity').notNull(),
  discount: doublePrecision('discount').notNull(),

  orderId: varchar('order_id').notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),

  productId: varchar('product_id').notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
});

export type Detail = InferModel<typeof details>;
