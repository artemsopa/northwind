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

export type Customer = InferModel<typeof customers>;
