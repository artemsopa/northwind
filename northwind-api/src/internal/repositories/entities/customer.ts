import {
  Entity, Column, OneToMany, PrimaryColumn,
} from 'typeorm';
import Order from './order';

@Entity({ name: 'customers' })
export default class Customer {
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

  @Column({ type: 'nvarchar', name: 'postal_code', nullable: true })
    postalCode: string | null;

  @Column({ type: 'nvarchar', name: 'region', nullable: true })
    region: string | null;

  @Column({ name: 'country' })
    country: string;

  @Column({ name: 'phone' })
    phone: string;

  @Column({ type: 'nvarchar', name: 'fax', nullable: true })
    fax: string | null;

  @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];

  constructor(
    id: string,
    companyName: string,
    contactName: string,
    contactTitle: string,
    address: string,
    city: string,
    postalCode: string | null,
    region: string | null,
    country: string,
    phone: string,
    fax: string | null,
  ) {
    this.id = id;
    this.companyName = companyName;
    this.contactName = contactName;
    this.contactTitle = contactTitle;
    this.address = address;
    this.city = city;
    this.postalCode = postalCode;
    this.region = region;
    this.country = country;
    this.phone = phone;
    this.fax = fax;
  }
}
