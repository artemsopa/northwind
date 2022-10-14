import { RequestHandler } from 'express';
import { OrdersService } from '@/services/orders';
import { Controller, wrapped } from '@/controllers/controller';
import { idSchema } from '@/validation/schemas';

export class OrdersController extends Controller {
  constructor(private readonly service: OrdersService) {
    super('/orders');
    this.service = service;
    this.router
      .get('/', wrapped(this.getAll))
      .get('/:id', wrapped(this.getInfo));
  }

  private getAll: RequestHandler = async (req, res) => {
    const orders = await this.service.getAll();
    res.status(200).json(orders);
  };

  private getInfo: RequestHandler = async (req, res) => {
    const params = idSchema.parse(req.params);
    const order = await this.service.getInfo(String(params.id));
    res.status(200).json(order);
  };
}
