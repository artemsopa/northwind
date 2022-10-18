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

const command = sql`SELECT e1.*, e2.last_name AS reports_lname, e2.first_name AS reports_fname 
    FROM employees AS e1 LEFT JOIN employees AS e2 ON e2.id = e1.recipient_id WHERE e1.id = ${id}`;
const { rows: [data] } = await this.db.execute(command);
```

At this example you can see as called self-join on table employees with receiving the array of all matched rows

## Examples of all drizzle-orm queries on sql

```JavaScript
await this.db.customers.select()
      .execute();
```
`SELECT * FROM customers;`

<br />

```JavaScript
await this.db.customers.select()
      .where(eq(table.id, id))
      .execute();
```
`SELECT * FROM customers WHERE id = ?;`

<br/>

```JavaScript
await this.db.customers.select()
      .where(ilike(table.companyName, `%${company}%`))
      .execute();
```
`SELECT * FROM customers WHERE LOWER(company_name) LIKE LOWER(%?%);`

<br/>

```JavaScript
await this.db.employees.select().execute();
```
`SELECT * FROM employees;`

<br/>

```JavaScript
const command = sql`SELECT e1.*, e2.last_name AS reports_lname, e2.first_name AS reports_fname FROM employees AS e1 LEFT JOIN employees AS e2 ON e2.id = e1.recipient_id WHERE e1.id = ${id}`;

const { rows: [data] } = await this.db.execute(command);
```
`SELECT e1.*, e2.last_name AS reports_lname, e2.first_name AS reports_fname FROM employees AS e1 LEFT JOIN employees AS e2 ON e2.id = e1.recipient_id WHERE e1.id = ?;`

<br/>

```JavaScript
await this.db.execute(sql`SELECT id, shipped_date, ship_name, ship_city, ship_country, COUNT(product_id) AS products, SUM(quantity) AS quantity, SUM(quantity * unit_price) AS total_price FROM orders AS o LEFT JOIN order_details AS od ON od.order_id = o.id GROUP BY o.id ORDER BY o.id ASC`);
```
`SELECT id, shipped_date, ship_name, ship_city, ship_country, COUNT(product_id) AS products, SUM(quantity) AS quantity, SUM(quantity * unit_price) AS total_price FROM orders AS o LEFT JOIN order_details AS od ON od.order_id = o.id GROUP BY o.id ORDER BY o.id ASC;`

<br/>

```JavaScript
await this.db.details.select()
      .leftJoin(table, eq(details.orderId, table.id))
      .leftJoin(productsTable, eq(details.productId, productsTable.id))
      .where(eq(details.orderId, id))
      .execute();
```
`SELECT * FROM order_details LEFT JOIN orders ON order_details.order_id = orders.id LEFT JOIN products ON order_details.product_id = products.id;`

<br/>

```JavaScript
await this.db.products.select().execute();
```
`SELECT * FROM products;`

<br/>

```JavaScript
await this.db.products.select()
      .leftJoin(suppliers, eq(table.supplierId, suppliers.id))
      .where(eq(table.id, id))
      .execute();
```
`SELECT * FROM products AS e1 LEFT JOIN suppliers ON products.supplier_id = suppliers.id WHERE products.id = ?;`

<br/>

```JavaScript
await this.db.products.select()
      .where(ilike(table.name, `%${name}%`))
      .execute();
```
`SELECT * FROM products WHERE LOWER(name) LIKE LOWER(%?%);`

<br/>

```JavaScript
await this.db.suppliers.select().execute();
```
`SELECT * FROM suppliers;`

<br/>

```JavaScript
await this.db.suppliers.select()
      .where(eq(table.id, id))
      .execute();
```
`SELECT * FROM suppliers WHERE id = ?;`

<br/>

#### For more examples you can see our [Github](https://github.com/artemsopa/northwind/tree/main/drizzle-orm "Github home") repository