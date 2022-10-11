import {
  pgTable, pgEnum, serial, text, integer, timestamp, InferModel,
} from 'drizzle-orm-pg';

export const queryTypeEnum = pgEnum('query_type', [
  'SELECT', 'SELECT_WHERE', 'SELECT_LEFT_JOIN',
]);

export const metrics = pgTable('metrics', {
  id: serial('id').primaryKey().notNull(),
  query: text('query').notNull(),
  ms: integer('ms').notNull(),
  type: queryTypeEnum('type').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});

export type Metric = InferModel<typeof metrics>;
