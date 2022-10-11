import {
  pgTable, pgEnum, serial, text, integer, timestamp, InferModel, PGDatabase,
} from 'drizzle-orm-pg';

export const queryTypeEnum = pgEnum('query_type', [
  'SELECT', 'WHERE', 'JOIN',
]);

export const metrics = pgTable('metrics', {
  id: serial('id').primaryKey().notNull(),
  query: text('query').notNull(),
  ms: integer('ms').notNull(),
  type: queryTypeEnum('type').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});

export const schema = {
  metrics,
};

export type Database = PGDatabase<typeof schema>;
