import 'reflect-metadata';
import b from 'benny';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const main = async () => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Invalid environment variables!');
  }

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
