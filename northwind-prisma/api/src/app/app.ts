import { SQS } from 'aws-sdk';
import { PrismaClient } from '@prisma/client';
import initConfigs from '../configs/configs';
import Handler from '../internal/delivery/handler';
import Repositories from '../internal/repositories/repositories';
import Services, { Deps } from '../internal/services/services';
import CSVReader from '../pkg/reader/csv.reader';
import SQSQueue from '../pkg/queue/sqs.queue';

const createApp = async () => {
  try {
    const cfgs = initConfigs();

    const prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'warn', emit: 'stdout' },
      ],
    });

    const reader = new CSVReader(cfgs.csv.CSV_DIR);
    const repos = new Repositories(prisma);
    const sqs = new SQS({
      accessKeyId: cfgs.aws.AWS_ACCESS_KEY,
      secretAccessKey: cfgs.aws.AWS_SECRET_KEY,
      region: cfgs.aws.AWS_REGION,
    });
    const sqsQueue = new SQSQueue(sqs, cfgs.aws.sqs.AWS_SQS_URL);

    const deps = new Deps(reader, repos);
    const services = new Services(deps);

    prisma.$on('query', async (e) => {
      await sqsQueue.enqueueMessage({
        query: `${e.query} ${e.params}`,
        ms: e.duration,
        date: e.timestamp,
      });
    });

    const handler = new Handler(services).initHandler();

    handler.listen(cfgs.app.PORT, () => console.log(`Server successfully started on ${cfgs.app.PORT}...`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default createApp;
