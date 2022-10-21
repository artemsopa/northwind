import bench from 'nanobench';

import { getConnectionTypeOrm } from './type-orm/index';
import { getConnectionPrismaOrm } from './prisma-orm/index';
import { getConnectionKysely } from './kysely-orm';
import { getConnectionDrizzleOrm } from './drizzle-orm';
import { getConnectionKnex } from './knex-orm';
import { getConnectionPgDriver } from './pg';

const main = async () => {
  const type = await getConnectionTypeOrm();
  const prisma = await getConnectionPrismaOrm();
  const kysely = await getConnectionKysely();
  const drizzle = await getConnectionDrizzleOrm();
  const knex = await getConnectionKnex();
  const pgDriver = await getConnectionPgDriver();

  const count = new Array(1000);

  bench('DrizzleOrm', async (b) => {
    b.start();

    for await (const i of count) {
      await drizzle.products.select().execute();
    }
    b.end();
  });
  bench('typeOrm', async (b) => {
    b.start();

    for await (const i of count) {
      await type.createQueryBuilder('products').getMany();
    }
    b.end();
  });
  bench('prismaOrm', async (b) => {
    b.start();

    for await (const i of count) {
      await prisma.product.findMany();
    }
    b.end();
  });
  bench('kyselyOrm', async (b) => {
    b.start();

    for await (const i of count) {
      await kysely.selectFrom('products').selectAll().execute();
    }
    b.end();
  });
  bench('knexOrm', async (b) => {
    b.start();

    for await (const i of count) {
      await knex('public.products').select();
    }
    b.end();
  });
  bench('pgDriver', async (b) => {
    b.start();

    for await (const i of count) {
      await pgDriver.query('select * from "products"');
    }
    b.end();
  });
};

main();
