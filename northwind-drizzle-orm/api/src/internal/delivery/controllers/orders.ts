import { RequestHandler } from 'express';
import { OrdersService } from '@/internal/services/orders';
import { Controller, wrapped } from '../app';
import { idReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';

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
    const params = validateSchema(idReqSchema, req.params);
    const order = await this.service.getInfo(params.id);
    res.status(200).json(order);
  };
}
