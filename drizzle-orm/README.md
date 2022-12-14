# Northwind sample databases for PostgreSQL with Drizzle-ORM implementing

At the beginning we need to install **drizzle-orm**, **drizzle-orm-pg**, **drizzle-kit**, **pg** packages by npm, yarn or another package manager.

   `npm i drizzle-orm drizzle-orm-pg pg`

   `npm i -D drizzle-kit`

## Implementation of DB tables

### Our project has followed tables: 
- customers
- employees
- orders
- order_details
- suppliers
- products

## Table examples

```JavaScript
import { InferModel, pgTable, varchar } from 'drizzle-orm-pg';

export const orders = pgTable('orders', {
  id: varchar('id').primaryKey().notNull(),
  orderDate: date('order_date', { mode: 'date' }).notNull(),
  requiredDate: date('required_date', { mode: 'date' }).notNull(),
  shippedDate: date('shipped_date', { mode: 'date' }),
  shipVia: integer('ship_via').notNull(),
  freight: doublePrecision('freight').notNull(),
  shipName: varchar('ship_name').notNull(),
  shipCity: varchar('ship_city').notNull(),
  shipRegion: varchar('ship_region'),
  shipPostalCode: varchar('ship_postal_code'),
  shipCountry: varchar('ship_country').notNull(),

  customerId: varchar('customer_id').notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),

  employeeId: varchar('employee_id').notNull()
    .references(() => employees.id, { onDelete: 'cascade' }),
});

export type Order = InferModel<typeof orders>;
```

At this example we define instance of `PgTable` by running `pgTable()` method with properties like `‘orders’` - table name, object
with properties have to be match table columns by indicating their types, like `varchar`, `date`, `integer` with property of column name,
indicating of `.primaryKey()` and `.notNull()` columns.

Also, we can define foreign keys, like `customerId` and `employeeId`, where we also define their type in table, relation with another table
and `onDelete` action. 

But if table need to have foreign key referenced to the same table it can be 3rd optional property - callback with our table returning object of foreign keys, indexes etc.

```JavaScript
import {
  pgTable, varchar, date, text, integer, InferModel, foreignKey,
} from 'drizzle-orm-pg';

export const employees = pgTable('employees', {
  id: varchar('id').primaryKey().notNull(),
  lastName: varchar('last_name').notNull(),
  firstName: varchar('first_name'),
  title: varchar('title').notNull(),
  titleOfCourtesy: varchar('title_of_courtesy').notNull(),
  birthDate: date('birth_date', { mode: 'date' }).notNull(),
  hireDate: date('hire_date', { mode: 'date' }).notNull(),
  address: varchar('address').notNull(),
  city: varchar('city').notNull(),
  postalCode: varchar('postal_code').notNull(),
  country: varchar('country').notNull(),
  homePhone: varchar('home_phone').notNull(),
  extension: integer('extension').notNull(),
  notes: text('notes').notNull(),
  recipientId: varchar('recipient_id'),
}, (table) => ({
  recipientFk: foreignKey(() => ({
    columns: [table.recipientId],
    foreignColumns: [table.id],
  })),
}));

export type Employee = InferModel<typeof employees>;
```

By `InferModel` we can get type of created table without code duplication.

And of course, we need to create our db schema, by which we can directly communicate with our db tables by **drizzle-orm**.

```JavaScript
import { PGDatabase } from 'drizzle-orm-pg';

export const schema = {
  customers,
  employees,
  orders,
  suppliers,
  products,
  details,
  metrics,
};

export type Database = PGDatabase<typeof schema>;
```

### Next step is migrations

For migrations we need to use **drizzle-kit** with **drizzle.config.json** file at the root of directory

```JSON
{
  "dialect": "pg",
  "out": "./migrations",
  "schema": "./src/data/schema.ts"
}
```

Where we can see `dialect` of db, property `out` that defines folder of migration containing and `schema` - path to the folder or file
with our tables

Command `drizzle-kit generate` generates next files: **migration.sql** with sql queries of tables creating 
and **snapshot.json** with as called snapshot

## Connecting to db and migrating

```JavaScript
import { PgConnector } from 'drizzle-orm-pg';
import { connect, migrate } from 'drizzle-orm';
import { Pool } from 'pg';

const pool = new Pool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
    const connector = new PgConnector(pool, schema);

const db = await connect(connector);
await migrate(connector, { migrationsFolder: 'migrations' });
```

First of all we create **connection pool** and **connector** with properties of `pool` and `schema`, connect to our database and 
migrate our migrations folder

## SQL queries

After passing **schema** with all defined tables before to the **connector**, we can refer to them as to db object properties
and execute queries for each one

```JavaScript
const data = await this.db.customers.select()
  .where(ilike(table.companyName, `%${company}%`))
  .execute();
```

By `.select()` we can select all table’s columns we need, by `.where()` we are filter our rows by some of columns.
`.ilike()` accepts table column and value it have to match. It is the same if we execute our query with
` ‘LOWER(column1) LIKE LOWER(%column2%)’`.

Without `LOWER` sql operator it can be `.like()` method with the same properties

## One of the best features are joins

```JavaScript
const [data] = await this.db.products.select()
      .leftJoin(suppliers, eq(table.supplierId, suppliers.id))
      .where(eq(table.id, id))
      .execute();
```

In `.leftJoin()` we pass table column needs to be joined, and by `eq()` function determine table columns need to be equal.
In our case we are join suppliers table on product’s `supplierId` equals suppliers’ `id` column, `.where()` product’s `id` equal passed value.

## Of course, we can execute simple sql queries

```JavaScript
import { sql } from 'drizzle-orm';

const command = sql`select "e1".*, "e2"."last_name" as "reports_lname", "e2"."first_name" as "reports_fname" from "employees" as "e1" left join "employees" as "e2" on "e2"."id" = "e1"."recipient_id" where "e1"."id" = ${id}`;
const { rows: [data] } = await this.db.execute(command);
```

At this example you can see as called self-join on table employees with receiving the array of all matched rows

## Examples of all drizzle-orm queries on sql

```JavaScript
await this.db.customers.select()
      .execute();
```
`select "id", "company_name", "contact_name", "contact_title", "address", "city", "postal_code", "region", "country", "phone", "fax" from "customers"`

<br />

```JavaScript
await this.db.customers.select()
      .where(eq(table.id, id))
      .execute();
```
`select "id", "company_name", "contact_name", "contact_title", "address", "city", "postal_code", "region", "country", "phone", "fax" from "customers" where "customers"."id" = $1`

<br/>

```JavaScript
await this.db.customers.select()
      .where(ilike(table.companyName, `%${company}%`))
      .execute();
```
`select "id", "company_name", "contact_name", "contact_title", "address", "city", "postal_code", "region", "country", "phone", "fax" from "customers" where "customers"."company_name" ilike $1`

<br/>

```JavaScript
await this.db.employees.select().execute();
```
`select "id", "last_name", "first_name", "title", "title_of_courtesy", "birth_date", "hire_date", "address", "city", "postal_code", "country", "home_phone", "extension", "notes", "recipient_id" from "employees"`

<br/>

```JavaScript
const command = sql`select "e1".*, "e2"."last_name" as "reports_lname", "e2"."first_name" as "reports_fname" from "employees" as "e1" left join "employees" as "e2" on "e2"."id" = "e1"."recipient_id" where "e1"."id" = ${id}`;

const { rows: [data] } = await this.db.execute(command);
```
`select "e1".*, "e2"."last_name" as "reports_lname", "e2"."first_name" as "reports_fname" from "employees" as "e1" left join "employees" as "e2" on "e2"."id" = "e1"."recipient_id" where "e1"."id" = $1`

<br/>

```JavaScript
await this.db.execute(sql`select "id", "shipped_date", "ship_name", "ship_city", "ship_country", count("product_id") as "products", sum("quantity") as "quantity", sum("quantity" * "unit_price") as "total_price" from "orders" as "o" left join "order_details" as "od" on "od"."order_id" = "o"."id" group by "o"."id" order by "o"."id" asc`);
```
`select "id", "shipped_date", "ship_name", "ship_city", "ship_country", count("product_id") as "products", sum("quantity") as "quantity", sum("quantity" * "unit_price") as "total_price" from "orders" as "o" left join "order_details" as "od" on "od"."order_id" = "o"."id" group by "o"."id" order by "o"."id" asc`

<br/>

```JavaScript
await this.db.details.select()
      .leftJoin(table, eq(details.orderId, table.id))
      .leftJoin(productsTable, eq(details.productId, productsTable.id))
      .where(eq(details.orderId, id))
      .execute();
```
`select "order_details"."unit_price", "order_details"."quantity", "order_details"."discount", "order_details"."order_id", "order_details"."product_id", "orders"."id", "orders"."order_date", "orders"."required_date", "orders"."shipped_date", "orders"."ship_via", "orders"."freight", "orders"."ship_name", "orders"."ship_city", "orders"."ship_region", "orders"."ship_postal_code", "orders"."ship_country", "orders"."customer_id", "orders"."employee_id", "products"."id", "products"."name", "products"."qt_per_unit", "products"."unit_price", "products"."units_in_stock", "products"."units_on_order", "products"."reorder_level", "products"."discontinued", "products"."supplier_id" from "order_details" left join "orders" on "order_details"."order_id" = "orders"."id" left join "products" on "order_details"."product_id" = "products"."id" where "order_details"."order_id" = $1`

<br/>

```JavaScript
await this.db.products.select().execute();
```
`select "id", "name", "qt_per_unit", "unit_price", "units_in_stock", "units_on_order", "reorder_level", "discontinued", "supplier_id" from "products"`

<br/>

```JavaScript
await this.db.products.select()
      .leftJoin(suppliers, eq(table.supplierId, suppliers.id))
      .where(eq(table.id, id))
      .execute();
```
`select "products"."id", "products"."name", "products"."qt_per_unit", "products"."unit_price", "products"."units_in_stock", "products"."units_on_order", "products"."reorder_level", "products"."discontinued", "products"."supplier_id", "suppliers"."id", "suppliers"."company_name", "suppliers"."contact_name", "suppliers"."contact_title", "suppliers"."address", "suppliers"."city", "suppliers"."region", "suppliers"."postal_code", "suppliers"."country", "suppliers"."phone" from "products" left join "suppliers" on "products"."supplier_id" = "suppliers"."id" where "products"."id" = $1`

<br/>

```JavaScript
await this.db.products.select()
      .where(ilike(table.name, `%${name}%`))
      .execute();
```
`select "id", "name", "qt_per_unit", "unit_price", "units_in_stock", "units_on_order", "reorder_level", "discontinued", "supplier_id" from "products" where "products"."name" ilike $1`

<br/>

```JavaScript
await this.db.suppliers.select().execute();
```
`select "id", "company_name", "contact_name", "contact_title", "address", "city", "region", "postal_code", "country", "phone" from "suppliers"`

<br/>

```JavaScript
await this.db.suppliers.select()
      .where(eq(table.id, id))
      .execute();
```
`select "id", "company_name", "contact_name", "contact_title", "address", "city", "region", "postal_code", "country", "phone" from "suppliers" where "suppliers"."id" = $1`

<br/>

#### For more examples you can see our [GitHub](https://github.com/artemsopa/northwind/tree/main/drizzle-orm "Github home") repository