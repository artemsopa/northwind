import Benchmark from 'benchmark';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const main = async () => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Invalid environment variables!');
  }

  const suite = new Benchmark.Suite();

  const prisma = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'warn', emit: 'stdout' },
    ],
  });

  suite
    .add('Select employee with recipient by id', async () => {
      await prisma.employee.findUnique({
        where: {
          id: '1',
        },
        include: {
          recipient: true,
        },
      });
    })
    .add('Select order_details with orders and products', async () => {
      await prisma.detail.findMany({
        where: {
          orderId: '10248',
        },
        include: {
          order: true,
          product: true,
        },
      });
    })
    .on('cycle', (event) => {
      console.log(String(event.target));
    })
    .on('complete', () => {
      console.log(`Fastest is ${suite.filter('fastest').map('name')}`);
    })
    .run({ async: true });
};

main();
