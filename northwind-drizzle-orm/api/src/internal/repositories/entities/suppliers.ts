import {
  InferModel, pgTable, varchar,
} from 'drizzle-orm-pg';

export const suppliers = pgTable('suppliers', {
  id: varchar('id').primaryKey().notNull(),
  companyName: varchar('company_name').notNull(),
  contactName: varchar('contact_name').notNull(),
  contactTitle: varchar('contact_title').notNull(),
  address: varchar('address').notNull(),
  city: varchar('city').notNull(),
  region: varchar('region'),
  postalCode: varchar('postal_code').notNull(),
  country: varchar('country').notNull(),
  phone: varchar('phone').notNull(),
});

export class Supplier implements InferModel<typeof suppliers> {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  address: string;
  city: string;
  region: string | null;
  postalCode: string;
  country: string;
  phone: string;
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
