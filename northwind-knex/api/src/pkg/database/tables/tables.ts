import { Knex } from 'knex';
import { createCustomersTable, dropCustomersTable } from './customers';
import { createDetailsTable, dropDetailsTable } from './details';
import { createEmpoloyeesTable, dropEmployeesTable } from './employees';
import { createMetricsTable, dropMetricsTable } from './metrics';
import { createOrdersTable, dropOrdersTable } from './orders';
import { createProductsTable, dropProductsTable } from './products';
import { createSuppliersTable, dropSuppliersTable } from './suppliers';

export const createTables = async (knex: Knex) => {
  if (!await knex.schema.withSchema('northwind_schema').hasTable('customers')) await createCustomersTable(knex);
  if (!await knex.schema.withSchema('northwind_schema').hasTable('employees')) await createEmpoloyeesTable(knex);
  if (!await knex.schema.withSchema('northwind_schema').hasTable('orders')) await createOrdersTable(knex);
  if (!await knex.schema.withSchema('northwind_schema').hasTable('suppliers')) await createSuppliersTable(knex);
  if (!await knex.schema.withSchema('northwind_schema').hasTable('products')) await createProductsTable(knex);
  if (!await knex.schema.withSchema('northwind_schema').hasTable('order_details')) await createDetailsTable(knex);
  if (!await knex.schema.withSchema('northwind_schema').hasTable('metrics')) await createMetricsTable(knex);
};

export const dropTables = async (knex: Knex) => {
  await dropDetailsTable(knex);
  await dropProductsTable(knex);
  await dropSuppliersTable(knex);
  await dropOrdersTable(knex);
  await dropEmployeesTable(knex);
  await dropCustomersTable(knex);
  await dropMetricsTable(knex);
};
