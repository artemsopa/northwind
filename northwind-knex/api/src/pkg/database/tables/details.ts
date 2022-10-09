import { Knex } from 'knex';

export const createDetailsTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .createTable('order_details', (table) => {
    table.decimal('unit_price', 10, 2).notNullable();
    table.integer('quantity').notNullable();
    table.decimal('discount', 10, 2).notNullable();

    table.string('orderId').primary().references('id').inTable('northwind_schema.orders')
      .onDelete('CASCADE');
    table.string('productId').primary().references('id').inTable('northwind_schema.orders')
      .onDelete('CASCADE');

    table.unique(['orderId', 'productId']);
  });

export const dropDetailsTable = async (knex: Knex) => await knex.schema
  .withSchema('northwind_schema')
  .dropTableIfExists('order_details');
