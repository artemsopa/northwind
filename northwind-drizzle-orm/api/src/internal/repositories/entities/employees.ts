import {
  pgTable, varchar, date, text, integer, InferModel, foreignKey, index,
} from 'drizzle-orm-pg';

export const employees = pgTable('employees', {
  id: varchar('id').primaryKey().notNull(),
  lastName: varchar('last_name').notNull(),
  firstName: varchar('first_name'),
  title: varchar('title').notNull(),
  titleOfCourtesy: varchar('title_of_courtesy').notNull(),
  birthDate: date('birth_date', { mode: 'date' }).notNull(),
  hireDate: date('hire_date', { mode: 'date' }).notNull(),
  address: varchar('adress').notNull(),
  city: varchar('city').notNull(),
  postalCode: varchar('postal_code').notNull(),
  country: varchar('country').notNull(),
  homePhone: varchar('home_phone').notNull(),
  extension: integer('extension').notNull(),
  notes: text('notes').notNull(),
  reportsTo: varchar('reports_to'),
}, (table) => ({
  recipientFk: foreignKey(() => ({
    columns: [table.reportsTo],
    foreignColumns: [table.id],
  })),
}));

export class Employee implements InferModel<typeof employees> {
  id: string;
  lastName: string;
  firstName: string | null;
  title: string;
  titleOfCourtesy: string;
  birthDate: Date;
  hireDate: Date;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  homePhone: string;
  extension: number;
  notes: string;
  reportsTo: string | null;

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

export interface ReportedEmployee {
  id: string,
  last_name: string,
  first_name: string | null,
  title: string,
  title_of_courtesy: string,
  birth_date: Date,
  hire_date: Date,
  address: string,
  city: string,
  postal_code: string,
  country: string,
  home_phone: string,
  extension: number,
  notes: string,
  reports_to: string | null,
  reports_lname: string | null,
  reports_fname: string | null
}
