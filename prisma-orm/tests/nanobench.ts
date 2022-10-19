import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const bench = require('nanobench');

dotenv.config();

const main = async () => {
  const prisma = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'warn', emit: 'stdout' },
    ],
  });

  bench('Select employee with recipient by id 10 times', async (b) => {
    b.start();

    for (let i = 0; i < 10; i++) {
      await prisma.employee.findUnique({
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

  bench('Select order_details with orders and products 10 times', async (b) => {
    b.start();

    for (let i = 0; i < 10; i++) {
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

    b.end();
  });
};

main();
