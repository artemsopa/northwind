import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('customers')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .execute();

  await db.schema
    .createTable('employees')
    .addColumn('id', 'varchar', (col) => col.primaryKey())

    .addColumn('recipient_id', 'varchar')
    .addForeignKeyConstraint(
      'recipient_id_fk',
      ['recipient_id'],
      'employees',
      ['id'],
    )
    .execute();

  await db.schema
    .createIndex('employee_recipient_id_index')
    .on('employees')
    .column('recipient_id')
    .execute();

  await db.schema
    .createTable('orders')
    .addColumn('id', 'varchar', (col) => col.primaryKey())

    .addColumn('customer_id', 'varchar', (col) => col.notNull())
    .addForeignKeyConstraint(
      'customer_id_fk',
      ['customer_id'],
      'customers',
      ['id'],
      (cb) => cb.onDelete('cascade'),
    )

    .addColumn('employee_id', 'varchar', (col) => col.notNull())
    .addForeignKeyConstraint(
      'employee_id_fk',
      ['employee_id'],
      'customers',
      ['id'],
      (cb) => cb.onDelete('cascade'),
    )
    .execute();

  await db.schema
    .createIndex('order_employee_id_index')
    .on('orders')
    .column('employee_id')
    .execute();

  await db.schema
    .createIndex('order_customer_id_index')
    .on('orders')
    .column('customer_id')
    .execute();

  await db.schema
    .createTable('suppliers')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .execute();

  await db.schema
    .createTable('products')
    .addColumn('id', 'varchar', (col) => col.primaryKey())

    .addColumn('supplier_id', 'varchar', (col) => col.notNull())
    .addForeignKeyConstraint(
      'supplier_id_fk',
      ['supplier_id'],
      'suppliers',
      ['id'],
      (cb) => cb.onDelete('cascade'),
    )
    .execute();

  await db.schema
    .createIndex('product_supplier_id_index')
    .on('products')
    .column('supplier_id')
    .execute();

  await db.schema
    .createTable('details')
    .addColumn('id', 'varchar', (col) => col.primaryKey())

    .addColumn('order_id', 'varchar', (col) => col.notNull())
    .addForeignKeyConstraint(
      'order_id_fk',
      ['order_id'],
      'orders',
      ['id'],
      (cb) => cb.onDelete('cascade'),
    )

    .addColumn('product_id', 'varchar', (col) => col.notNull())
    .addForeignKeyConstraint(
      'product_id_fk',
      ['product_id'],
      'products',
      ['id'],
      (cb) => cb.onDelete('cascade'),
    )
    .execute();

  await db.schema
    .createIndex('detail_order_id_index')
    .on('details')
    .column('order_id')
    .execute();

  await db.schema
    .createIndex('detial_product_id_index')
    .on('details')
    .column('product_id')
    .execute();

  await db.schema
    .createTable('metrics')
    .addColumn('id', 'uuid', (col) => col.autoIncrement().primaryKey())
    .addColumn('query', 'text', (col) => col.notNull())
    .addColumn('ms', 'integer', (col) => col.notNull())
    .addColumn('type', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('details').execute();
  await db.schema.dropTable('products').execute();
  await db.schema.dropTable('suppliers').execute();
  await db.schema.dropTable('orders').execute();
  await db.schema.dropTable('employees').execute();
  await db.schema.dropTable('customers').execute();
  await db.schema.dropTable('metrics').execute();
}
