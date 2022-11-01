import { run, bench, group } from 'mitata';
import { getConnection as getDrizzle } from 'src/drizzle-orm/index';
import { getConnection as getKnex } from 'src/knex-orm/index';
import { getConnection as getKysely } from 'src/kysely-orm/index';
import { getConnection as getPg } from 'src/pg/index';
import { getConnection as getPrisma } from 'src/prisma-orm/index';
import { getConnection as getMikro } from 'src/mikro-orm/index';

import { Customer as CustomerTypeOrm } from 'src/typeorm/entities/customers';
import { Employee as EmployeeTypeOrm } from 'src/typeorm/entities/employees';
import { Supplier as SupplierTypeOrm } from 'src/typeorm/entities/suppliers';
import { Product as ProductTypeOrm} from 'src/typeorm/entities/products';
import { Order as OrderTypeOrm } from 'src/typeorm/entities/orders';
import { Detail as DetailTypeOrm } from 'src/typeorm/entities/details';

import { Customer as CustomerMikroOrm } from 'src/mikro-orm/entities/customers';
import { Employee as EmployeeMikroOrm} from 'src/mikro-orm/entities/employees';
import { Supplier as SupplierMikroOrm } from 'src/mikro-orm/entities/suppliers';
import { Product as ProductMikroOrm } from 'src/mikro-orm/entities/products';
import { Order as OrderMikroOrm } from 'src/mikro-orm/entities/orders';
import { Detail as DetailMikroOrm } from 'src/mikro-orm/entities/details';

import { getConnection as getTypeorm } from 'src/typeorm/index';
import { eq, ilike } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';
import { sql as kyselySql } from 'kysely';

import { customers, details, orders, products, suppliers } from './drizzle-orm/data/schema';

const main = async () => {
  try {
    const pg = await getPg();
    const drizzle = await getDrizzle();
    const prisma = await getPrisma();
    const kysely = await getKysely();
    const knex = await getKnex();
    // const typeorm = await getTypeorm();
    const mikro = await getMikro();
    const count = new Array(1000);
    group('Customers: getAll', () => {
      bench('Pg Driver Customers: getAll', async () => {
        for await (const i of count) {
          await pg.query('select * from "customers"');
        }
      });
      bench('Drizzle-ORM Customers: getAll', async () => {
        for await (const i of count) await drizzle.customers.select().execute();
      });
      bench('Prisma ORM Customers: getAll', async () => {
        for await (const i of count) {
          await prisma.customer.findMany();
        }
      });
      bench('Kysely ORM Customers: getAll', async () => {
        for await (const i of count) {
          await kysely.selectFrom('customers').selectAll().execute();
        }
      });
      bench('Knex ORM Customers: getAll', async () => {
        for await (const i of count) {
          await knex('public.customers').select();
        }
      });
      // bench('TypeORM Customers: getAll', async () => {
      //   for await (const i of count) {
      //     await typeorm.getRepository(Customer).createQueryBuilder('customers').getMany();
      //   }
      // });
      bench('MikroORM Customers: getAll', async () => {
        for await (const i of count) await mikro.find(CustomerMikroOrm, {});
      });
    });

    group('Customers: getInfo', () => {
      bench('Pg Driver Customers: getInfo', async () => {
        for await (const i of count) {
          await pg.query('select * from "customers" where "customers"."id" = $1', ['ALFKI']);
        }
      });
      bench('Drizzle-ORM Customers: getInfo', async () => {
        for await (const i of count) {
          await drizzle.customers.select()
            .where(eq(customers.id, 'ALFKI'))
            .execute();
        }
      });
      bench('Prisma ORM Customers: getInfo', async () => {
        for await (const i of count) {
          await prisma.customer.findUnique({
            where: {
              id: 'ALFKI',
            },
          });
        }
      });
      bench('Kysely ORM Customers: getInfo', async () => {
        for await (const i of count) {
          await kysely.selectFrom('customers')
            .selectAll()
            .where('customers.id', '=', 'ALFKI')
            .limit(1)
            .execute();
        }
      });
      bench('Knex ORM Customers: getInfo', async () => {
        for await (const i of count) {
          await knex('public.customers').where({ id: 'ALFKI' }).first();
        }
      });
      // bench('TypeORM Customers: getInfo', async () => {
      //   for await (const i of count) {
      //     await typeorm.getRepository(Customer).createQueryBuilder('customers')
      //       .where('customers.id = :id', { id: 'ALFKI' })
      //       .getOne();
      //   }
      // });
      bench('MikroORM Customers: getInfo', async () => {
        for await (const i of count) await mikro.findOne(CustomerMikroOrm, { id: 'ALFKI' });
      });
    });

    group('Customers: search', () => {
      bench('Pg Driver Customers: search', async () => {
        for await (const i of count) {
          await pg.query('select * from "customers" where "customers"."company_name" ilike $1', ['ha']);
        }
      });
      bench('Drizzle-ORM Customers: search', async () => {
        for await (const i of count) {
          await drizzle.customers.select()
            .where(ilike(customers.companyName, `%${'ha'}%`))
            .execute();
        }
      });
      bench('Prisma ORM Customers: search', async () => {
        for await (const i of count) {
          await prisma.customer.findMany({
            where: {
              companyName: {
                contains: 'ha',
                mode: 'insensitive',
              },
            },
          });
        }
      });
      bench('Kysely ORM Customers: search', async () => {
        for await (const i of count) {
          await kysely.selectFrom('customers')
            .selectAll()
            .where(kyselySql`company_name`, 'ilike', '%ha%')
            .execute();
        }
      });
      bench('Knex ORM Customers: search', async () => {
        for await (const i of count) {
          await knex('public.customers')
            .whereRaw('company_name ILIKE ?', ['%ha%']).select();
        }
      });
      // bench('TypeORM Customers: search', async () => {
      //   for await (const i of count) {
      //     await typeorm.getRepository(Customer).createQueryBuilder('customers')
      //       .where('customers.company_name ilike :company', { company: '%ha%' })
      //       .getMany();
      //   }
      // });
      bench('MikroORM Customers: search', async () => {
        for await (const i of count) {
          await mikro.find(CustomerMikroOrm, {
            companyName: { $ilike: '%ha%' },
          });
        }
      });
    });

    group(' Employees: getAll', () => {
      bench('Pg Driver Employees: getAll', async () => {
        for await (const i of count) {
          await pg.query('select * from "employees"');
        }
      });
      bench('Drizzle-ORM Employees: getAll', async () => {
        for await (const i of count) await drizzle.employees.select().execute();
      });
      bench('Prisma ORM Employees: getAll', async () => {
        for await (const i of count) {
          await prisma.employee.findMany();
        }
      });
      bench('Kysely ORM Employees: getAll', async () => {
        for await (const i of count) {
          await kysely.selectFrom('employees').selectAll().execute();
        }
      });
      bench('Knex ORM Employees: getAll', async () => {
        for await (const i of count) {
          await knex('public.employees').select();
        }
      });
      // bench('TypeORM Employees: getAll', async () => {
      //   for await (const i of count) {
      //     await typeorm.getRepository(Employee).createQueryBuilder('employees').getMany();
      //   }
      // });
      bench('MikroORM Employees: getAll', async () => {
        for await (const i of count) await mikro.find(EmployeeMikroOrm, {});
      });
    });

    group('Employees: getInfo', () => {
      bench('Pg Driver Employees: getInfo', async () => {
        for await (const i of count) {
          await pg.query(`select "e1".*, "e2"."last_name" as "reports_lname", "e2"."first_name" as "reports_fname"
            from "employees" as "e1" left join "employees" as "e2" on "e2"."id" = "e1"."recipient_id" where "e1"."id" = $1`, ['1']);
        }
      });
      bench('Drizzle-ORM Employees: getInfo', async () => {
        for await (const i of count) {
          const command = sql`select "e1".*, "e2"."last_name" as "reports_lname", "e2"."first_name" as "reports_fname"
              from "employees" as "e1" left join "employees" as "e2" on "e2"."id" = "e1"."recipient_id" where "e1"."id" = '1'`;
          await drizzle.execute(command);
        }
      });
      bench('Prisma ORM Employees: getInfo', async () => {
        for await (const i of count) {
          await prisma.employee.findUnique({
            where: {
              id: '1',
            },
            include: {
              recipient: true,
            },
          });
        }
      });
      bench('Kysely ORM Employees: getInfo', async () => {
        for await (const i of count) {
          await kysely.selectFrom('employees as e1')
            .selectAll()
            .where('e1.id', '=', '1')
            .limit(1)
            .leftJoinLateral(
              (eb) => eb.selectFrom('employees as e2')
                .select(['id as e_id', 'last_name as e_last_name', 'first_name as e_first_name'])
                .whereRef('e1.recipient_id', '=', 'e2.id')
                .as('e2'),
              (join) => join.onTrue(),
            )
            .execute();
        }
      });
      bench('Knex ORM Employees: getInfo', async () => {
        for await (const i of count) {
          await knex('public.employees as e1')
            .whereRaw('e1.id = (?)', ['1'])
            .leftJoin(
              'public.employees as e2',
              'e1.recipient_id',
              'e2.id',
            )
            .select(['e1.*', 'e2.id as e_id', 'e2.last_name as e_last_name', 'e2.first_name as e_first_name']);
        }
      });
      // bench('TypeORM Employees: getInfo', async () => {
      //   for await (const i of count) {
      //     await typeorm.getRepository(Employee).createQueryBuilder('employees')
      //       .leftJoinAndSelect(
      //         'employees.recipient',
      //         'recipients',
      //       ).where('employees.id = :id', { id: '1' })
      //       .getOne();
      //   }
      // });
      bench('MikroORM Employees: getInfo', async () => {
        for await (const i of count) {
          await mikro.findOne(
            EmployeeMikroOrm,
            { id: '1' },
            { populate: ['recipient'] },
          );
        }
      });
    });

    group('Suppliers: getAll', () => {
      bench('Pg Driver Suppliers: getAll', async () => {
        for await (const i of count) {
          await pg.query('select * from "suppliers"');
        }
      });
      bench('Drizzle-ORM Suppliers: getAll', async () => {
        for await (const i of count) await drizzle.suppliers.select().execute();
      });
      bench('Prisma ORM Suppliers: getAll', async () => {
        for await (const i of count) {
          await prisma.supplier.findMany();
        }
      });
      bench('Kysely ORM Suppliers: getAll', async () => {
        for await (const i of count) {
          await kysely.selectFrom('suppliers').selectAll().execute();
        }
      });
      bench('Knex ORM Suppliers: getAll', async () => {
        for await (const i of count) {
          await knex('public.suppliers').select();
        }
      });
      // bench('TypeORM Suppliers: getAll', async () => {
      //   for await (const i of count) {
      //     await typeorm.getRepository(Supplier).createQueryBuilder('suppliers').getMany();
      //   }
      // });
      bench('MikroORM Suppliers: getAll', async () => {
        for await (const i of count) await mikro.find(EmployeeMikroOrm, {});
      });
    });

    group('Suppliers: getInfo', () => {
      bench('Pg Driver Suppliers: getInfo', async () => {
        for await (const i of count) {
          await pg.query('select * from "suppliers" where "suppliers"."id" = $1', ['1']);
        }
      });
      bench('Drizzle-ORM Suppliers: getInfo', async () => {
        for await (const i of count) {
          await drizzle.suppliers.select()
            .where(eq(suppliers.id, '1'))
            .execute();
        }
      });
      bench('Prisma ORM Suppliers: getInfo', async () => {
        for await (const i of count) {
          await prisma.supplier.findUnique({
            where: {
              id: '1',
            },
          });
        }
      });
      bench('Kysely ORM Suppliers: getInfo', async () => {
        for await (const i of count) {
          await kysely.selectFrom('suppliers')
            .selectAll()
            .where('suppliers.id', '=', '1')
            .limit(1)
            .execute();
        }
      });
      bench('Knex ORM Suppliers: getInfo', async () => {
        for await (const i of count) {
          await knex('public.suppliers').where({ id: '1' }).first();
        }
      });
      // bench('TypeORM Suppliers: getInfo', async () => {
      //   for await (const i of count) {
      //     await typeorm.getRepository(Supplier).createQueryBuilder('suppliers')
      //       .where('suppliers.id = :id', { id: '1' })
      //       .getOne();
      //   }
      // });
      bench('MikroORM Suppliers: getInfo', async () => {
        for await (const i of count) {
          for await (const i of count) await mikro.findOne(SupplierMikroOrm, { id: '1' });
        }
      });
    });


    group('Products: getAll', () => {
      bench('Pg Driver Products: getAll', async () => {
        for await (const i of count) {
          await pg.query('select * from "products"');
        }
      });
      bench('Drizzle-ORM Products: getAll', async () => {
        for await (const i of count) {
          await drizzle.products.select().execute();
        }
      });
      bench('Prisma ORM Products: getAll', async () => {
        for await (const i of count) {
          await prisma.product.findMany();
        }
      });
      bench('Kysely ORM Products: getAll', async () => {
        for await (const i of count) {
          await kysely.selectFrom('products').selectAll().execute();
        }
      });
      bench('Knex ORM Products: getAll', async () => {
        for await (const i of count) {
          await knex('public.products').select();
        }
      });
      // bench('TypeORM Products: getAll', async () => {
      //   for await (const i of count) {
      //     await typeorm.getRepository(Product).createQueryBuilder('products').getMany();
      //   }
      // });
      bench('MikroORM Products: getAll', async () => {
        for await (const i of count) await mikro.find(ProductMikroOrm, {});
      });
    });

    group('Products: getInfo', () => {
      bench('Pg Driver Products: getInfo', async () => {
        for await (const i of count) {
          await pg.query(`select "products".*, "suppliers".*
            from "products" left join "suppliers" on "products"."supplier_id" = "suppliers"."id" where "products"."id" = $1`, ['1']);
        }
      });
      bench('Drizzle-ORM Products: getInfo', async () => {
        for await (const i of count) {
          await drizzle.products.select()
            .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
            .where(eq(products.id, '1'))
            .execute();
        }
      });
      bench('Prisma ORM Products: getInfo', async () => {
        for await (const i of count) {
          await prisma.product.findUnique({
            where: {
              id: '1',
            },
            include: {
              supplier: true,
            },
          });
        }
      });
      bench('Kysely ORM Products: getInfo', async () => {
        for await (const i of count) {
          await kysely.selectFrom('products')
            .selectAll()
            .where('products.id', '=', '1')
            .limit(1)
            .leftJoinLateral(
              (eb) => eb.selectFrom('suppliers')
                .select(['suppliers.id as s_id', 'suppliers.company_name as s_company_name'])
                .whereRef('suppliers.id', '=', 'products.supplier_id')
                .as('s1'),
              (join) => join.onTrue(),
            )
            .execute();
        }
      });
      bench('Knex ORM Products: getInfo', async () => {
        for await (const i of count) {
          await knex('public.products')
            .select(['products.*', 'suppliers.id as s_id', 'suppliers.company_name as s_company_name'])
            .whereRaw('products.id = (?)', ['1'])
            .leftJoin(
              'public.suppliers',
              'products.supplier_id',
              'suppliers.id',
            );
        }
      });
      // bench('TypeORM Products: getInfo', async () => {
      //   for await (const i of count) {
      //     await typeorm.getRepository(Product).createQueryBuilder('products')
      //       .leftJoinAndSelect(
      //         'products.supplier',
      //         'suppliers',
      //       ).where('products.id = :id', { id: '1' })
      //       .getOne();
      //   }
      // });
      bench('MikroORM Products: getInfo', async () => {
        for await (const i of count) {
          await mikro.findOne(
            ProductMikroOrm,
            { id: '1' },
            { populate: ['supplier'] },
          );
        }
      });
    });

    group('Products: search', () => {
      bench('Pg Driver Products: search', async () => {
        for await (const i of count) {
          await pg.query('select * from "products" where "products"."name" ilike $1', ['cha']);
        }
      });
      bench('Drizzle-ORM Products: search', async () => {
        for await (const i of count) {
          await drizzle.products.select()
            .where(ilike(products.name, `%${'cha'}%`))
            .execute();
        }
      });
      bench('Prisma ORM Products: search', async () => {
        for await (const i of count) {
          await prisma.product.findMany({
            where: {
              name: {
                contains: 'cha',
                mode: 'insensitive',
              },
            },
          });
        }
      });
      bench('Kysely ORM Products: search', async () => {
        for await (const i of count) {
          await kysely.selectFrom('products')
            .selectAll()
            .where(kyselySql`name`, 'ilike', `%${'cha'.toLowerCase()}%`)
            .execute();
        }
      });
      bench('Knex ORM Products: search', async () => {
        for await (const i of count) {
          await knex('public.products')
            .whereRaw('name ILIKE ?', ['%cha%']).select();
        }
      });
      // bench('TypeORM Products: search', async () => {
      //   for await (const i of count) {
      //     await typeorm.getRepository(Product).createQueryBuilder('products')
      //       .where('products.name ilike :name', { name: '%cha%' })
      //       .getMany();
      //   }
      // });
      bench('MikroORM Products: search', async () => {
        for await (const i of count) {
          await mikro.find(ProductMikroOrm, {
              name: { $ilike: '%cha%' },
            });
        }
      });
    });

    group('Orders: getAll', () => {
      bench('Pg Driver Orders: getAll', async () => {
        for await (const i of count) {
          await pg.query(`select "id", "shipped_date", "ship_name", "ship_city", "ship_country", count("product_id") as "products",
          sum("quantity") as "quantity", sum("quantity" * "unit_price") as "total_price"
          from "orders" as "o" left join "order_details" as "od" on "od"."order_id" = "o"."id" group by "o"."id" order by "o"."id" asc`);
        }
      });

      bench('Drizzle-ORM Orders: getAll', async () => {
        for await (const i of count) {
          const command = sql`select "id", "shipped_date", "ship_name", "ship_city", "ship_country",
              count("product_id") as "products", sum("quantity") as "quantity", sum("quantity" * "unit_price") as "total_price"
              from "orders" as "o" left join "order_details" as "od" on "od"."order_id" = "o"."id" group by "o"."id" order by "o"."id" asc`;

          await drizzle.execute(command);
        }
      });
      bench('Prisma ORM Orders: getAll', async () => {
        for await (const i of count) {
          await prisma.order.findMany({
            include: {
              details: true,
            },
          });
        }
      });

      bench('Kysely ORM Orders: getAll', async () => {
        for await (const i of count) {
          await kysely.selectFrom('orders')
            .selectAll()
            .leftJoinLateral(
              (eb) => eb.selectFrom('order_details')
                .select(['quantity', 'unit_price'])
                .whereRef('order_details.order_id', '=', 'orders.id')
                .as('e'),
              (join) => join.onTrue(),
            ).execute();
        }
      });

      bench('Knex ORM Orders: getAll', async () => {
      // Query with agregate columns
        for await (const i of count) {
          await knex('public.orders')
            .select([
              'orders.id',
              'orders.shipped_date',
              'orders.ship_name',
              'orders.ship_city',
              'orders.ship_country',
            ])
            .leftJoin(
              'public.order_details',
              'order_details.order_id',
              'orders.id',
            )
            .count('product_id as products')
            .sum('quantity as quantity')
            .sum(knex.raw('?? * ??', ['quantity', 'unit_price']))
            .groupBy('orders.id')
            .orderBy('orders.id', 'asc');
        }
      });
      // bench('TypeORM Orders: getAll', async () => {
      //   for await (const i of count) {
      //     await typeorm.getRepository(Order)
      //       .createQueryBuilder('orders')
      //       .leftJoinAndSelect(
      //         'orders.details',
      //         'order_details',
      //       ).getMany();
      //   }
      // });
      bench('MikroORM Orders: getAll', async () => {
        for await (const i of count) {
          await mikro.find(
              OrderMikroOrm,
              {},
              { populate: ['details'] },
            );
        }
      });
    });

    group('Orders: getInfo', () => {
      bench('Pg Driver Orders: getInfo', async () => {
        for await (const i of count) {
          await pg.query(`select "order_details"."unit_price", "order_details"."quantity", "order_details"."discount", "order_details"."order_id",
          "order_details"."product_id", "orders"."id", "orders"."order_date", "orders"."required_date", "orders"."shipped_date", "orders"."ship_via",
          "orders"."freight", "orders"."ship_name", "orders"."ship_city", "orders"."ship_region", "orders"."ship_postal_code", "orders"."ship_country",
          "orders"."customer_id", "orders"."employee_id", "products"."id", "products"."name", "products"."qt_per_unit", "products"."unit_price",
          "products"."units_in_stock", "products"."units_on_order", "products"."reorder_level", "products"."discontinued", "products"."supplier_id"
          from "order_details" left join "orders" on "order_details"."order_id" = "orders"."id"
          left join "products" on "order_details"."product_id" = "products"."id" where "order_details"."order_id" = $1`, ['10248']);
        }
      });
      bench('Drizzle-ORM Orders: getInfo', async () => {
        for await (const i of count) {
          await drizzle.details.select()
            .leftJoin(orders, eq(details.orderId, orders.id))
            .leftJoin(products, eq(details.productId, orders.id))
            .where(eq(details.orderId, '10248'))
            .execute();
        }
      });
      bench('Prisma ORM Orders: getInfo', async () => {
        for await (const i of count) {
          await prisma.detail.findMany({
            where: {
              orderId: '10248',
            },
            include: {
              order: true,
              product: true,
            },
          });
        }
      });
      bench('Kysely ORM Orders: getInfo', async () => {
        for await (const i of count) {
          await kysely.selectFrom('order_details')
            .selectAll()
            .where('order_id', '=', '10248')
            .leftJoinLateral(
              (eb) => eb.selectFrom('orders')
                .select([
                  'ship_name',
                  'ship_via',
                  'freight',
                  'order_date',
                  'required_date',
                  'shipped_date',
                  'ship_city',
                  'ship_region',
                  'ship_postal_code',
                  'ship_country',
                  'customer_id',
                ])
                .whereRef('order_details.order_id', '=', 'orders.id')
                .as('o'),
              (join) => join.onTrue(),
            )
            .leftJoinLateral(
              (eb) => eb.selectFrom('products')
                .select(['id as p_id', 'name as p_name'])
                .whereRef('order_details.product_id', '=', 'products.id')
                .as('p'),
              (join) => join.onTrue(),
            )
            .execute();
        }
      });
      bench('Knex ORM Orders: getInfo', async () => {
        for await (const i of count) {
          await knex('public.order_details as od')
            .whereRaw('od.order_id = (?)', ['10248'])
            .leftJoin(
              'public.orders as o',
              'o.id',
              'od.order_id',
            )
            .leftJoin(
              'public.products as p',
              'p.id',
              'od.product_id',
            )
            .select([
              'o.*',
              'od.unit_price as od_uprice',
              'od.quantity as od_quantity',
              'od.discount as od_discount',
              'p.id as p_id',
              'p.name as p_name',
            ]);
        }
      });
      // bench('TypeORM Orders: getInfo', async () => {
      //   for await (const i of count) {
      //     await typeorm.getRepository(Detail)
      //       .createQueryBuilder('order_details')
      //       .leftJoinAndSelect(
      //         'order_details.order',
      //         'orders',
      //       ).leftJoinAndSelect(
      //         'order_details.product',
      //         'products',
      //       )
      //       .where('order_details.order_id = :id', { id: '10248' })
      //       .getMany();
      //   }
      // });
      bench('MikroORM Orders: getInfo', async () => {
        for await (const i of count) {
          await mikro.find(
            DetailMikroOrm,
            { orderId: '10248' },
            { populate: ['order', 'product'] },
          );
        }
      });
    });

    await run();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
