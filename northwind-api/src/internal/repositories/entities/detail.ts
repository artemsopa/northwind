import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn,
} from 'typeorm';
import Order from './order';
import Product from './product';

@Entity({ name: 'order_details' })
export default class Detail {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({
    name: 'unit_price', type: 'decimal', precision: 10, scale: 2, default: 0,
  })
    unitPrice: number;

  @Column({ name: 'quantity' })
    quantity: number;

  @Column({
    name: 'discount', type: 'decimal', precision: 10, scale: 2, default: 0,
  })
    discount: number;

  @Column({ name: 'order_id' })
    orderId: string;
  @ManyToOne(() => Order, (order) => order.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
    order: Order;

  @Column({ name: 'product_id' })
    productId: string;
  @ManyToOne(() => Product, (product) => product.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
    product: Product;

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
