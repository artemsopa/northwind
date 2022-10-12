import { RequestHandler } from 'express';
import { MetricsService } from '@/internal/services/metrics';
import { Controller, wrapped } from '@/internal/delivery/app';

export class MetricsController extends Controller {
  constructor(private readonly service: MetricsService) {
    super('/metrics');
    this.service = service;
    this.router
      .get('/', wrapped(this.getAll));
  }

  private getAll: RequestHandler = async (req, res) => {
    const metrics = await this.service.getAll();
    res.status(200).json(metrics);
  };
}
