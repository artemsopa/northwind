import {
  pgTable, pgEnum, serial, text, integer, timestamp, InferModel,
} from 'drizzle-orm-pg';

export const queryTypeEnum = pgEnum('query_type', [
  'SELECT', 'SELECT_WHERE', 'SELECT_LEFT_JOIN', 'SELECT_LEFT_JOIN_WHERE',
]);

export const metrics = pgTable('metrics', {
  id: serial('id').primaryKey().notNull(),
  queryString: text('query_string').notNull(),
  ms: integer('ms').notNull(),
  queryType: queryTypeEnum('query_type').notNull(),
  created_at: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});

export type Metric = InferModel<typeof metrics>;
