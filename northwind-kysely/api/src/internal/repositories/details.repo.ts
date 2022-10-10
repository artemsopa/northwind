import { Kysely } from 'kysely';
import { Detail } from './types/detail';
import { IDetailsRepo } from './repositories';
import Database from './types/types';

class DetailsRepo implements IDetailsRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async createMany(details: Detail[]): Promise<void> {
    await this.db.insertInto('details').values(details).execute()
  }

  async deleteAll(): Promise<void> {
    await this.db.deleteFrom('details').execute();
  }
}

export default DetailsRepo;
