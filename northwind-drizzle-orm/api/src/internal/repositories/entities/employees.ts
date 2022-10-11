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
  recipientId: varchar('recipientId'),
}, (table) => ({
  recipientFk: foreignKey(() => ({
    columns: [table.recipientId],
    foreignColumns: [table.id],
  })),
}));

export type Employee = InferModel<typeof employees>;
