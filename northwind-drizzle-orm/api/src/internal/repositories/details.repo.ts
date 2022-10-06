import { IDetailsRepo } from './repositories';
import { Detail } from './entities/details';
import { DataBase } from './entities/schema';

class DetailsRepo implements IDetailsRepo {
  constructor(private readonly db: DataBase) {
    this.db = db;
  }

  async createMany(details: Detail[]): Promise<void> {
    await this.db.details.insert(details).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.details.delete().execute();
  }
}

export default DetailsRepo;
