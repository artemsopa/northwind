import { Detail } from './entities/details';
import { Database } from './entities/schema';

export class DetailsRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async createMany(details: Detail[]): Promise<void> {
    await this.db.details.insert(details).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.details.delete().execute();
  }
}
