import { SQS } from 'aws-sdk';
import initConfigs from '../configs/configs';
import Handler from '../internal/delivery/handler';
import Repositories from '../internal/repositories/repositories';
import Services, { Deps } from '../internal/services/services';
import initDbConnection from '../pkg/database/mysql.db';
import CSVReader from '../pkg/reader/csv.reader';
import SQSQueue from '../pkg/queue/sqs.queue';

const createApp = async () => {
  const cfgs = initConfigs();
  const ds = await initDbConnection(cfgs.db.DB_HOST, cfgs.db.DB_PORT, cfgs.db.DB_USER, cfgs.db.DB_PASSWORD, cfgs.db.DB_NAME);

  const reader = new CSVReader(cfgs.csv.CSV_DIR);
  const repos = new Repositories(ds);
  const sqs = new SQS({
    accessKeyId: cfgs.aws.AWS_ACCESS_KEY,
    secretAccessKey: cfgs.aws.AWS_SECRET_KEY,
    region: cfgs.aws.AWS_REGION,
  });
  const sqsQueue = new SQSQueue(sqs, cfgs.aws.sqs.AWS_SQS_URL);

  const deps = new Deps(reader, repos, sqsQueue);
  const services = new Services(deps);
  const handler = new Handler(services).initHandler();

  handler.listen(cfgs.app.PORT, () => 'Server susscessfully started...');
};

export default createApp;
