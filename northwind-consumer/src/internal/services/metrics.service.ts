import { IMetricsService } from './services';
import { IMetricsRepo } from '../repositories/repositories';
import { EnqueuedMetric } from './dtos/metric';

class MetricsService implements IMetricsService {
  constructor(private metricsRepo: IMetricsRepo) {
    this.metricsRepo = metricsRepo;
  }

  async create(metric: EnqueuedMetric): Promise<void> {
    await this.metricsRepo.create(metric.query, metric.ms, metric.type);
  }
}

export default MetricsService;
