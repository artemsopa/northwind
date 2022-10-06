import { DataSource, Repository } from 'typeorm';
import Metric from './entities/metric';
import { IMetricsRepo } from './repositories';

class MetricsRepo implements IMetricsRepo {
  private repo: Repository<Metric>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Metric);
  }

  async getAll(): Promise<Metric[]> {
    return await this.repo.find();
  }
}

export default MetricsRepo;
