import {
  Entity, Column, ManyToOne, JoinColumn, OneToMany, PrimaryColumn,
} from 'typeorm';
import Customer from './customer';
import Detail from './detail';
import Employee from './employee';

@Entity({ name: 'orders' })
export default class Order {
  @PrimaryColumn()
    id: string;

  @Column({ name: 'order_date', type: 'date' })
    orderDate: Date;

  @Column({ name: 'required_date' })
    requiredDate: Date;

  @Column({ type: 'nvarchar', name: 'shipped_date', nullable: true })
    shippedDate: Date | null;

  @Column({ name: 'ship_via' })
    shipVia: number;

  @Column({
    name: 'freight', type: 'decimal', precision: 10, scale: 2, default: 0,
  })
    freight: number;

  @Column({ name: 'ship_name' })
    shipName: string;

  @Column({ name: 'ship_city' })
    shipCity: string;

  @Column({ type: 'nvarchar', name: 'ship_region', nullable: true })
    shipRegion: string | null;

  @Column({ type: 'nvarchar', name: 'ship_postal_code', nullable: true })
    shipPostalCode: string | null;

  @Column({ name: 'ship_country' })
    shipCountry: string;

  @Column({ name: 'customer_id' })
    customerId: string;
  @ManyToOne(() => Customer, (customer) => customer.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
    customer: Customer;

  @Column({ name: 'employee_id' })
    employeeId: string;
  @ManyToOne(() => Employee, (employee) => employee.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
    employee: Employee;

  @OneToMany(() => Detail, (detail) => detail.order)
    details: Detail[];

  constructor(
    id: string,
    orderDate: Date,
    requiredDate: Date,
    shippedDate: Date | null,
    shipVia: number,
    freight: number,
    shipName: string,
    shipCity: string,
    shipRegion: string | null,
    shipPostalCode: string,
    shipCountry: string,
    customerId: string,
    employeeId: string,
  ) {
    this.id = id;
    this.orderDate = orderDate;
    this.requiredDate = requiredDate;
    this.shippedDate = shippedDate;
    this.shipVia = shipVia;
    this.freight = freight;
    this.shipName = shipName;
    this.shipCity = shipCity;
    this.shipRegion = shipRegion;
    this.shipPostalCode = shipPostalCode;
    this.shipCountry = shipCountry;
    this.customerId = customerId;
    this.employeeId = employeeId;
  }
}
