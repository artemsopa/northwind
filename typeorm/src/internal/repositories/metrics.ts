import { DataSource, Repository } from 'typeorm';
import { Metric } from './entities/metrics';

export class MetricsRepo {
  private readonly repo: Repository<Metric>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Metric);
  }

  async getAll() {
    return await this.repo.find();
  }
}
