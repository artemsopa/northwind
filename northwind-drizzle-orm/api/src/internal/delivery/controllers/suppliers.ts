import { NextFunction, Request, RequestHandler, Response } from 'express';
import { SuppliersService } from 'src/internal/services/suppliers';
import { Controller, wrapped } from '../app';
import { idReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';

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
    const params = validateSchema(idReqSchema, req.params);
    const supplier = await this.service.getInfo(params.id);
    res.status(200).json(supplier);
  };
}
