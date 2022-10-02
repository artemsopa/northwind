import {
  Entity, Column, OneToMany, PrimaryColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import Order from './order';

@Entity({ name: 'employees' })
export default class Employee {
  @PrimaryColumn()
    id: string;

  @Column({ name: 'last_name' })
    lastName: string;

  @Column({ type: 'nvarchar', name: 'first_name', nullable: true })
    firstName: string | null;

  @Column({ name: 'title' })
    title: string;

  @Column({ name: 'title_of_courtesy' })
    titleOfCourtesy: string;

  @Column({ name: 'birth_date', type: 'date' })
    birthDate: Date;

  @Column({ name: 'hire_date', type: 'date' })
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

  @Column({ type: 'longtext', name: 'notes' })
    notes: string;

  @Column({ type: 'nvarchar', name: 'reports_to', nullable: true })
    reportsTo: string | null;
  @ManyToOne(() => Employee, (employee) => employee.recipient)
  @JoinColumn({ name: 'reports_to' })
    recipient: Employee;

  @OneToMany(() => Order, (order) => order.employee)
    orders: Order[];

  constructor(
    id: string,
    lastName: string,
    firstName: string | null,
    title: string,
    titleOfCourtesy: string,
    birthDate: Date,
    hireDate: Date,
    address: string,
    city: string,
    postalCode: string,
    country: string,
    homePhone: string,
    extension: number,
    notes: string,
    reportsTo: string | null,
  ) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.title = title;
    this.titleOfCourtesy = titleOfCourtesy;
    this.birthDate = birthDate;
    this.hireDate = hireDate;
    this.address = address;
    this.city = city;
    this.postalCode = postalCode;
    this.country = country;
    this.homePhone = homePhone;
    this.extension = extension;
    this.notes = notes;
    this.reportsTo = reportsTo;
  }
}
