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

export type Supplier = InferModel<typeof suppliers>;
