import { PrismaClient } from '@prisma/client';
import { SQS } from 'aws-sdk';
import initConfigs from '../configs/configs';
import Repositories from '../internal/repositories/repositories';
import Services, { Deps } from '../internal/services/services';
import SQSQueue from '../pkg/queue/sqs.queue';

const createApp = async () => {
  const cfgs = initConfigs();
  const prisma = new PrismaClient();

  const repos = new Repositories(prisma);
  const sqsQueue = new SQSQueue(new SQS({}), cfgs.aws.sqs.AWS_SQS_URL);

  const deps = new Deps(repos, sqsQueue);
  const services = new Services(deps);

  return services.cuonsumer;
};

export default createApp();
