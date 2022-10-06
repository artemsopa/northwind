import {
  index,
  integer,
  jsonb,
  PGDatabase,
  pgTable,
  serial,
  text,
  InferModel,
  varchar,
} from 'drizzle-orm-pg';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    username: text('username').notNull(),
    password: text('password').notNull(),
    salt: text('salt').notNull(),
  },
  (table) => ({
    usernameConstraint: index('username_idx', table.username, { unique: true }),
  }),
);
export type User = InferModel<typeof users>;

export const quizes = pgTable(
  'quizes',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    shortCode: varchar('short_code', { length: 6 }).notNull(),
    ownerId: integer('owner_id').references(() => users.id),
  },
  (table) => ({
    codeIdx: index('short_code_idx', table.shortCode, { unique: true }),
  }),
);
export type Quiz = InferModel<typeof quizes>;

export const quizQuestions = pgTable('quiz_questions', {
  id: serial('id').primaryKey(),
  type: text<'single' | 'multiple'>('type').notNull(),
  parent: integer('quiz_id').references(() => quizes.id),
  text: text('text').notNull(),
  answers: jsonb<string[]>('answers').notNull(),
  correctAnsers: jsonb<number[]>('correct_answers').notNull(),
});

export const quizQuestions2 = pgTable('quiz_questions2', {
  id: serial('id').primaryKey(),
  type: text<'single' | 'multiple'>('type').notNull(),
  parent: integer('quiz_id').references(() => quizes.id),
  text: text('text').notNull(),
  answers: jsonb<string[]>('answers').notNull(),
  correctAnsers: jsonb<number[]>('correct_answers').notNull(),
});

export type QuizQuestion = InferModel<typeof quizQuestions>;

export const passedQuizes = pgTable('passed_quizes', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id')
    .notNull()
    .references(() => quizes.id),
  answers:
      jsonb<{ questionId: number; answers: number[] }[]>('answers').notNull(),
});

export const schema = {
  users,
  quizes,
  quizQuestions,
  passedQuizes,
};

// export type DB = PGDatabase<typeof schema>;
