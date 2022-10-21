import benny from 'benny'

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

  benny.suite(
    'Example',
    benny.add('DrizzleOrm', async () => {
      await drizzle.products.select().execute();
    }),

    benny.add('typeOrm', async () => {
      await type.createQueryBuilder('products').getMany();
    }),

    benny.add('prismaOrm', async () => {
      await prisma.product.findMany();
    }),

    benny.add('kyselyOrm', async () => {
      await kysely.selectFrom('products').selectAll().execute();
    }),

    benny.add('knexOrm', async () => {
      await knex('public.products').select();
    }),

    benny.add('pgDriver', async () => {
      await pgDriver.query('select * from "products"');
    }),

    benny.cycle(),
    benny.complete(),
  );
};

main();
