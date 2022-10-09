import { Knex } from 'knex';

export const createMetricsTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .createTable('metrics', (table) => {
    table.uuid('id').primary();
    table.text('query').notNullable();
    table.integer('ms').notNullable();
    table.enu('type', [
      'SELECT',
      'SELECT_WHERE',
      'SELECT_LEFT_JOIN',
      'SELECT_LEFT_JOIN_WHERE',
    ]).defaultTo('SELECT');
    table.dateTime('created_at').defaultTo(knex.fn.now());
  });

export const dropMetricsTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .dropTableIfExists('metrics');
