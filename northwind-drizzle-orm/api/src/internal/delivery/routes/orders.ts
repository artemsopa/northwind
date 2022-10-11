import {
  NextFunction, Request, Response, Router,
} from 'express';
import { OrdersService } from 'src/internal/services/orders';
import { idReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';

export class OrdersRoute {
  constructor(private readonly service: OrdersService) {
    this.service = service;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this))
      .get('/:id', this.getInfo.bind(this));
  }

  private async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await this.service.getAll();
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  private async getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateSchema(idReqSchema, req.params);
      const order = await this.service.getInfo(params.id);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
}
