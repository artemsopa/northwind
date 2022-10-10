import { Kysely } from 'kysely';
import Database, { MetricInput } from './types/types';
import { IMetricsRepo } from './repositories';

class MetricsRepo implements IMetricsRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async create(metric: MetricInput): Promise<void> {
    await this.db.insertInto('metrics').values(metric).execute();
  }
}

export default MetricsRepo;
