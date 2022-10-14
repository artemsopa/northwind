import {
  Entity, Column, OneToMany, PrimaryColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Order } from '@/entities/orders';

@Entity({ name: 'employees' })
export class Employee {
  @PrimaryColumn()
    id: string;

  @Column({ name: 'last_name' })
    lastName: string;

  @Column({ name: 'first_name', type: 'varchar', nullable: true })
    firstName: string | null;

  @Column({ name: 'title' })
    title: string;

  @Column({ name: 'title_of_courtesy' })
    titleOfCourtesy: string;

  @Column({ name: 'birth_date' })
    birthDate: Date;

  @Column({ name: 'hire_date' })
    hireDate: Date;

  @Column({ name: 'address' })
    address: string;

  @Column({ name: 'city' })
    city: string;

  @Column({ name: 'postal_code' })
    postalCode: string;

  @Column({ name: 'country' })
    country: string;

  @Column({ name: 'home_phone' })
    homePhone: string;

  @Column({ name: 'extension' })
    extension: number;

  @Column({ name: 'notes', type: 'text' })
    notes: string;

  @Column({ name: 'recipient_id', type: 'varchar', nullable: true })
    recipientId: string | null;
  @ManyToOne(() => Employee, (employee) => employee.recipient)
  @JoinColumn({ name: 'recipient_id' })
    recipient: Employee;

  @OneToMany(() => Order, (order) => order.employee)
    orders: Order[];
}
