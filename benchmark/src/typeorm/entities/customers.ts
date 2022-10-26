import {
  Entity, Column, OneToMany, PrimaryColumn,
} from 'typeorm';
import { Order } from '@/typeorm/entities/orders';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryColumn()
    id: string;

  @Column({ name: 'company_name' })
    companyName: string;

  @Column({ name: 'contact_name' })
    contactName: string;

  @Column({ name: 'contact_title' })
    contactTitle: string;

  @Column({ name: 'address' })
    address: string;

  @Column({ name: 'city' })
    city: string;

  @Column({ name: 'postal_code', type: 'varchar', nullable: true })
    postalCode: string | null;

  @Column({ name: 'region', type: 'varchar', nullable: true })
    region: string | null;

  @Column({ name: 'country' })
    country: string;

  @Column({ name: 'phone' })
    phone: string;

  @Column({ name: 'fax', type: 'varchar', nullable: true })
    fax: string | null;

  @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];
}
