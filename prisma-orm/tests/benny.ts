import b from 'benny';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const main = async () => {
  const prisma = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'warn', emit: 'stdout' },
    ],
  });

  b.suite(
    'Benny tests',

    b.add('Select employee with recipient by id', async () => {
      await prisma.employee.findUnique({
        where: {
          id: '1',
        },
        include: {
          recipient: true,
        },
      });
    }),

    b.add('Select order_details with orders and products', async () => {
      await prisma.detail.findMany({
        where: {
          orderId: '10248',
        },
        include: {
          order: true,
          product: true,
        },
      });
    }),

    b.cycle(),
    b.complete(),
    b.save({ file: 'reduce', version: '1.0.0' }),
    b.save({ file: 'reduce', format: 'chart.html' }),
  );
};

main();
