import { Kysely } from 'kysely';
import { Metric } from './types/metric';
import { IMetricsRepo } from './repositories';
import Database from './types/types';

class MetricsRepo implements IMetricsRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll(): Promise<Metric[]> {
    return await this.db.selectFrom('metrics').execute() as Metric[];
  }
}

export default MetricsRepo;
