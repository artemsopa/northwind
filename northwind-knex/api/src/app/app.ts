import { SQS } from 'aws-sdk';
import initConfigs from '../configs/configs';
import Handler from '../internal/delivery/handler';
import Repositories from '../internal/repositories/repositories';
import Services, { Deps } from '../internal/services/services';
import initDbConnection from '../pkg/database/database';
import CSVReader from '../pkg/reader/csv.reader';
import SQSQueue from '../pkg/queue/sqs.queue';

const createApp = async () => {
  try {
    const cfgs = initConfigs();
    const knex = await initDbConnection(cfgs.db.DB_HOST, cfgs.db.DB_PORT, cfgs.db.DB_USER, cfgs.db.DB_PASSWORD, cfgs.db.DB_NAME, cfgs.db.MIGRATION_DIR);

    const reader = new CSVReader(cfgs.csv.CSV_DIR);
    const repos = new Repositories(knex);
    const sqs = new SQS({
      accessKeyId: cfgs.aws.AWS_ACCESS_KEY,
      secretAccessKey: cfgs.aws.AWS_SECRET_KEY,
      region: cfgs.aws.AWS_REGION,
    });
    const sqsQueue = new SQSQueue(sqs, cfgs.aws.sqs.AWS_SQS_URL);

    knex.on('query', (query) => {
      console.log(String(`${query.sql} ${query.bindings}`));
    });

    const deps = new Deps(reader, repos, sqsQueue);
    const services = new Services(deps);
    const handler = new Handler(services).initHandler();

    handler.listen(cfgs.app.PORT, () => console.log(`Server successfully started on ${cfgs.app.PORT}...`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default createApp;
