import { Kysely } from 'kysely';
import { Database } from '@/internal/repositories/interfaces/interfaces';

export class MetricsRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll() {
    return await this.db.selectFrom('metrics').selectAll().execute();
  }
}
