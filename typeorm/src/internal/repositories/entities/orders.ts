import {
  Entity, Column, ManyToOne, JoinColumn, OneToMany, PrimaryColumn,
} from 'typeorm';
import { Customer } from '@/internal/repositories/entities/customers';
import { Detail } from '@/internal/repositories/entities/details';
import { Employee } from '@/internal/repositories/entities/employees';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryColumn({ select: false })
    id: string;

  @Column({ name: 'order_date', type: 'date' })
    orderDate: Date;

  @Column({ name: 'required_date' })
    requiredDate: Date;

  @Column({ name: 'shipped_date', type: 'date', nullable: true })
    shippedDate: Date | null;

  @Column({ name: 'ship_via' })
    shipVia: number;

  @Column({ name: 'freight', type: 'decimal', precision: 10, scale: 2, default: 0 })
    freight: number;

  @Column({ name: 'ship_name' })
    shipName: string;

  @Column({ name: 'ship_city' })
    shipCity: string;

  @Column({ name: 'ship_region', type: 'varchar', nullable: true })
    shipRegion: string | null;

  @Column({ name: 'ship_postal_code', type: 'varchar', nullable: true })
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
}
