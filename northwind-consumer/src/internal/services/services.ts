import Repositories from '../repositories/repositories';
import { EnqueuedMetric } from './dtos/metric';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import MetricsService from './metrics.service';

export interface IMetricsService {
  create(metric: EnqueuedMetric): Promise<void>;
}

export class Deps {
  queue: ISQSQueue;
  repos: Repositories;
  constructor(repos: Repositories, queue: ISQSQueue) {
    this.queue = queue;
    this.repos = repos;
  }
}

export default class Services {
  metrics: IMetricsService;
  constructor(deps: Deps) {
    this.metrics = new MetricsService(deps.repos.metrics);
  }
}
