import { Knex } from 'knex';

export const createCustomersTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .createTable('customers', (table) => {
    table.string('id').primary();
    table.string('company_name').notNullable();
    table.string('contact_name').notNullable();
    table.string('contact_title').notNullable();
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.string('postal_code').nullable();
    table.string('region').nullable();
    table.string('country').notNullable();
    table.string('phone').notNullable();
    table.string('fax').nullable();
  });

export const dropCustomersTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .dropTableIfExists('customers');
