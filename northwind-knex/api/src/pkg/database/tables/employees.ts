import { Knex } from 'knex';

export const createEmpoloyeesTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .createTable('employees', (table) => {
    table.string('id').primary();
    table.string('last_name').notNullable();
    table.string('first_name').nullable();
    table.string('title').notNullable();
    table.string('title_of_courtesy').notNullable();
    table.dateTime('birth_date').notNullable();
    table.dateTime('hire_date').nullable();
    table.string('address').nullable();
    table.string('city').notNullable();
    table.string('postal_code').notNullable();
    table.string('country').notNullable();
    table.string('home_phone').notNullable();
    table.integer('extension').notNullable();
    table.text('notes').notNullable();
    table.string('recipientId').nullable().references('id').inTable('northwind_schema.employees');
  });

export const dropEmployeesTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .dropTableIfExists('employees');
