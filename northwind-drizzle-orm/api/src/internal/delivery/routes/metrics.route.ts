import {
  NextFunction, Request, Response, Router,
} from 'express';
import { MetricsService } from '../../services/metrics.service';

export class MetricsRoute {
  constructor(private readonly service: MetricsService) {
    this.service = service;
  }

  initRoutes() {
    return Router()
      .get('/metrics', this.getAllMetrics.bind(this));
  }

  private async getAllMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await this.service.getAllMetrics();
      res.status(200).json(metrics);
    } catch (error) {
      next(error);
    }
  }
}
