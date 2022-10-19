import Benchmark from 'benchmark';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const main = async () => {
  const suite = new Benchmark.Suite('Benchmark tests', {
    initCount: 10,
  });

  const prisma = new PrismaClient();

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
    .on('cycle', (event: any) => {
      console.log(String(event.target));
    })
    .on('complete', () => {
      console.log(`Fastest is ${suite.filter('fastest').map('name')}`);
    })
    .run({ async: true });
};

main();
