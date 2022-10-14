import { RequestHandler } from 'express';
import { SuppliersService } from '@/services/suppliers';
import { Controller, wrapped } from '@/app';
import { idSchema } from '@/zod-schemas/schemas';

export class SuppliersController extends Controller {
  constructor(private readonly service: SuppliersService) {
    super('/suppliers');
    this.service = service;
    this.router
      .get('/', wrapped(this.getAll))
      .get('/:id', wrapped(this.getInfo));
  }

  private getAll: RequestHandler = async (req, res) => {
    const suppliers = await this.service.getAll();
    res.status(200).json(suppliers);
  };

  private getInfo: RequestHandler = async (req, res) => {
    const params = idSchema.parse(req.params);
    const supplier = await this.service.getInfo(String(params.id));
    res.status(200).json(supplier);
  };
}
