import { DataSource, Repository } from 'typeorm';
import { IDetailsRepo } from './repositories';
import Detail from './entities/detail';

class DetailsRepo implements IDetailsRepo {
  private repo: Repository<Detail>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Detail);
  }

  async createMany(details: Detail[]): Promise<void> {
    await this.repo.save(details);
  }

  async deleteAll(): Promise<void> {
    await this.repo.createQueryBuilder('details').delete().execute();
  }
}

export default DetailsRepo;
