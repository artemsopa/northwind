import { Knex } from 'knex';

export const createProductsTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .createTable('products', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('qt_per_unit').notNullable();
    table.decimal('unit_price', 10, 2).notNullable();
    table.integer('units_in_stock').notNullable();
    table.integer('units_on_order').notNullable();
    table.integer('reorder_level').notNullable();
    table.string('discontinued').notNullable();

    table.string('supplierId').notNullable().references('id').inTable('northwind_schema.suppliers')
      .onDelete('CASCADE');
  });

export const dropProductsTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .dropTableIfExists('products');
