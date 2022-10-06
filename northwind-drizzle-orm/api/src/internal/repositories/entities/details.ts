import {
  pgTable, varchar, integer, doublePrecision, InferModel,
} from 'drizzle-orm-pg';
import { orders } from './orders';
import { products } from './products';

export const details = pgTable('order_details', {
  unitPrice: doublePrecision('unit_price').notNull(),
  quantity: integer('quantity').notNull(),
  discount: doublePrecision('discount').notNull(),

  orderId: varchar('order_id').notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),

  productId: varchar('product_id').notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
});

export class Detail implements InferModel<typeof details> {
  unitPrice: number;
  quantity: number;
  discount: number;
  orderId: string;
  productId: string;
  constructor(
    unitPrice: number,
    quantity: number,
    discount: number,
    orderId: string,
    productId: string,
  ) {
    this.unitPrice = unitPrice;
    this.quantity = quantity;
    this.discount = discount;
    this.orderId = orderId;
    this.productId = productId;
  }
}
