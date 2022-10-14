import {
  Entity, Column, OneToMany, PrimaryColumn,
} from 'typeorm';
import { Product } from '@/entities/products';

@Entity({ name: 'suppliers' })
export class Supplier {
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

  @Column({ name: 'region', type: 'varchar', nullable: true })
    region: string | null;

  @Column({ name: 'postal_code' })
    postalCode: string;

  @Column({ name: 'country' })
    country: string;

  @Column({ name: 'phone' })
    phone: string;

  @OneToMany(() => Product, (product) => product.supplier)
    products: Product[];
}
