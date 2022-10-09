import { Knex } from 'knex';

export const createSuppliersTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .createTable('suppliers', (table) => {
    table.string('id').primary();
    table.string('company_name').notNullable();
    table.string('contact_name').notNullable();
    table.string('contact_title').notNullable();
    table.integer('address').notNullable();
    table.string('city').notNullable();
    table.string('region').notNullable();
    table.string('postal_code').nullable();
    table.string('country').notNullable();
    table.string('phone').notNullable();
  });

export const dropSuppliersTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .dropTableIfExists('suppliers');
