import bench from 'nanobench';

import { getConnection } from '@/prisma-orm';

export const startPrismaOrmBenches = async () => {
  const db = await getConnection();

  const count = new Array(1000);

  await bench('Prisma ORM Customers: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.customer.findMany();
    }
    b.end();
  });
  await bench('Prisma ORM Customers: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.customer.findUnique({
        where: {
          id: 'ALFKI',
        },
      });
    }
    b.end();
  });
  await bench('Prisma ORM Customers: search', async (b) => {
    b.start();
    for await (const i of count) {
      await db.customer.findMany({
        where: {
          companyName: {
            contains: 'ha',
            mode: 'insensitive',
          },
        },
      });
    }
    b.end();
  });

  await bench('Prisma ORM Employees: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.employee.findMany();
    }
    b.end();
  });
  await bench('Prisma ORM Employees: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.employee.findUnique({
        where: {
          id: '1',
        },
        include: {
          recipient: true,
        },
      });
    }
    b.end();
  });

  await bench('Prisma ORM Suppliers: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.supplier.findMany();
    }
    b.end();
  });
  await bench('Prisma ORM Suppliers: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.supplier.findUnique({
        where: {
          id: '1',
        },
      });
    }
    b.end();
  });

  await bench('Prisma ORM Products: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.product.findMany();
    }
    b.end();
  });
  await bench('Prisma ORM Products: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.product.findUnique({
        where: {
          id: '1',
        },
        include: {
          supplier: true,
        },
      });
    }
    b.end();
  });
  await bench('Prisma ORM Products: search', async (b) => {
    b.start();
    for await (const i of count) {
      await db.product.findMany({
        where: {
          name: {
            contains: 'cha',
            mode: 'insensitive',
          },
        },
      });
    }
    b.end();
  });

  await bench('Prisma ORM Orders: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.order.findMany({
        include: {
          details: true,
        },
      });
    }
    b.end();
  });
  await bench('Prisma ORM Orders: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.detail.findMany({
        where: {
          orderId: '10248',
        },
        include: {
          order: true,
          product: true,
        },
      });
    }
    b.end();
  });
};
