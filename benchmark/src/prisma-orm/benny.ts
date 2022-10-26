import benny from 'benny';

import { getConnection } from '@/prisma-orm';

export const startPrismaOrmSuites = async () => {
  const db = await getConnection();

  await benny.suite(
    'Prisma-ORM',

    benny.add('Prisma-ORM Customers: getAll', async () => {
      await db.customer.findMany();
    }),
    benny.add('Prisma-ORM Customers: getInfo', async () => {
      await db.customer.findUnique({
        where: {
          id: 'ALFKI',
        },
      });
    }),
    benny.add('Prisma-ORM Customers: search', async () => {
      await db.customer.findMany({
        where: {
          companyName: {
            contains: 'ha',
            mode: 'insensitive',
          },
        },
      });
    }),

    benny.add('Prisma-ORM Employees: getAll', async () => {
      await db.employee.findMany();
    }),
    benny.add('Prisma-ORM Employees: getInfo', async () => {
      await db.employee.findUnique({
        where: {
          id: '1',
        },
        include: {
          recipient: true,
        },
      });
    }),

    benny.add('Prisma-ORM Suppliers: getAll', async () => {
      await db.supplier.findMany();
    }),
    benny.add('Prisma-ORM Suppliers: getInfo', async () => {
      await db.supplier.findUnique({
        where: {
          id: '1',
        },
      });
    }),

    benny.add('Prisma-ORM Products: getAll', async () => {
      await db.product.findMany();
    }),
    benny.add('Prisma-ORM Products: getInfo', async () => {
      await db.product.findUnique({
        where: {
          id: '1',
        },
        include: {
          supplier: true,
        },
      });
    }),
    benny.add('Prisma-ORM Products: search', async () => {
      await db.product.findMany({
        where: {
          name: {
            contains: 'cha',
            mode: 'insensitive',
          },
        },
      });
    }),

    benny.add('Prisma-ORM Orders: getAll', async () => {
      await db.order.findMany({
        include: {
          details: true,
        },
      });
    }),
    benny.add('Prisma-ORM Orders: getInfo', async () => {
      await db.detail.findMany({
        where: {
          orderId: '10248',
        },
        include: {
          order: true,
          product: true,
        },
      });
    }),

    benny.cycle(),
    benny.complete(),
  );
};
