import {
  Entity, Column, OneToMany, PrimaryColumn,
} from 'typeorm';
import Product from './product';

@Entity({ name: 'suppliers' })
export default class Supplier {
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

  @Column({ type: 'nvarchar', name: 'region', nullable: true })
    region: string | null;

  @Column({ name: 'postal_code' })
    postalCode: string;

  @Column({ name: 'country' })
    country: string;

  @Column({ name: 'phone' })
    phone: string;

  @OneToMany(() => Product, (product) => product.supplier)
    products: Product[];

  constructor(
    id: string,
    companyName: string,
    contactName: string,
    contactTitle: string,
    address: string,
    city: string,
    region: string | null,
    postalCode: string,
    country: string,
    phone: string,
  ) {
    this.id = id;
    this.companyName = companyName;
    this.contactName = contactName;
    this.contactTitle = contactTitle;
    this.address = address;
    this.city = city;
    this.region = region;
    this.postalCode = postalCode;
    this.country = country;
    this.phone = phone;
  }
}
