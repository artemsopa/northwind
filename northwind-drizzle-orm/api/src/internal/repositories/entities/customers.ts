import { InferModel, pgTable, varchar } from 'drizzle-orm-pg';

export const customers = pgTable('customers', {
  id: varchar('id', { length: 5 }).primaryKey().notNull(),
  companyName: varchar('company_name').notNull(),
  contactName: varchar('contact_name').notNull(),
  contactTitle: varchar('contact_title').notNull(),
  address: varchar('address').notNull(),
  city: varchar('city').notNull(),
  postalCode: varchar('postal_code'),
  region: varchar('region'),
  country: varchar('country').notNull(),
  phone: varchar('phone').notNull(),
  fax: varchar('fax'),
});

export class Customer implements InferModel<typeof customers> {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  address: string;
  city: string;
  postalCode: string | null;
  region: string | null;
  country: string;
  phone: string;
  fax: string | null;

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
