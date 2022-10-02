import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IOrdersService } from '../../services/services';
import { idReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';

class OrdersRoute {
  constructor(private ordersService: IOrdersService) {
    this.ordersService = ordersService;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this))
      .get('/:id', this.getInfo.bind(this));
  }

  private async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await this.ordersService.getAll();
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  private async getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateSchema(idReqSchema, req.params);
      const order = await this.ordersService.getInfo(params.id);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
}

export default OrdersRoute;
