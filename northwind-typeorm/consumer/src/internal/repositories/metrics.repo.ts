import { DataSource, Repository } from 'typeorm';
import Metric, { QueryTypes } from './entities/metric';
import { IMetricsRepo } from './repositories';

class MetricsRepo implements IMetricsRepo {
  private repo: Repository<Metric>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Metric);
  }

  async getAll(): Promise<Metric[]> {
    return await this.repo.find();
  }

  async create(metric: Metric): Promise<void> {
    await this.repo.save(metric);
  }
}

export default MetricsRepo;