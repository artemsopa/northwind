import { SQS } from 'aws-sdk';
import initConfigs from '../configs/configs';
import Repositories from '../internal/repositories/repositories';
import Services, { Deps } from '../internal/services/services';
import initDbConnection from '../pkg/database/mysql.db';
import SQSQueue from '../pkg/queue/sqs.queue';
import Consumer from '../internal/delivery/consumer';

const createApp = async () => {
  const cfgs = initConfigs();
  const ds = await initDbConnection(cfgs.db.DB_HOST, cfgs.db.DB_PORT, cfgs.db.DB_USER, cfgs.db.DB_PASSWORD, cfgs.db.DB_NAME);

  const repos = new Repositories(ds);
  const sqsQueue = new SQSQueue(new SQS({}), cfgs.aws.sqs.AWS_SQS_URL);

  const deps = new Deps(repos, sqsQueue);
  const services = new Services(deps);
  const consumer = new Consumer(services.metrics, sqsQueue);

  return consumer;
};

export default createApp();
