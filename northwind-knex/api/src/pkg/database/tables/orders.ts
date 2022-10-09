import { Knex } from 'knex';

export const createOrdersTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .createTable('orders', (table) => {
    table.string('id').primary();
    table.dateTime('order_date').notNullable();
    table.dateTime('required_date').notNullable();
    table.dateTime('shipped_date').nullable();
    table.integer('ship_via').notNullable();
    table.decimal('freight', 10, 2).notNullable();
    table.string('ship_name').notNullable();
    table.string('ship_city').notNullable();
    table.string('ship_region').nullable();
    table.string('ship_postal_code').notNullable();
    table.string('ship_country').notNullable();

    table.string('customerId').notNullable().references('id').inTable('northwind_schema.customers')
      .onDelete('CASCADE');
    table.string('employeeId').notNullable().references('id').inTable('northwind_schema.employees')
      .onDelete('CASCADE');
  });

export const dropOrdersTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .dropTableIfExists('orders');
