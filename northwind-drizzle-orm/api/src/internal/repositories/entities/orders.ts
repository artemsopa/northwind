import {
  pgTable, varchar, date, integer, doublePrecision, InferModel,
} from 'drizzle-orm-pg';
import { customers } from './customers';
import { employees } from './employees';

export const orders = pgTable('orders', {
  id: varchar('id').primaryKey().notNull(),
  orderDate: date('order_date', { mode: 'date' }).notNull(),
  requiredDate: date('required_date', { mode: 'date' }).notNull(),
  shippedDate: date('shipped_date', { mode: 'date' }),
  shipVia: integer('ship_via').notNull(),
  freight: doublePrecision('freight').notNull(),
  shipName: varchar('ship_name').notNull(),
  shipCity: varchar('ship_city').notNull(),
  shipRegion: varchar('ship_region'),
  shipPostalCode: varchar('ship_postal_code'),
  shipCountry: varchar('ship_country').notNull(),

  customerId: varchar('customer_id').notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),

  employeeId: varchar('employee_id').notNull()
    .references(() => employees.id, { onDelete: 'cascade' }),
});

export class Order implements InferModel<typeof orders> {
  id: string;
  orderDate: Date;
  requiredDate: Date;
  shippedDate: Date | null;
  shipVia: number;
  freight: number;
  shipName: string;
  shipCity: string;
  shipRegion: string | null;
  shipPostalCode: string | null;
  shipCountry: string;
  customerId: string;
  employeeId: string;
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
    shipPostalCode: string | null,
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
