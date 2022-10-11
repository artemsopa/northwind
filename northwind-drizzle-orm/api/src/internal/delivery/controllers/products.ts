import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ProductsService } from 'src/internal/services/products';
import { Controller, wrapped } from '../app';
import { idReqSchema, productReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';

export class ProductsController extends Controller {
  constructor(private readonly service: ProductsService) {
    super('/products');
    this.service = service;
    this.router
      .get('/', wrapped(this.getAll))
      .get('/:id', wrapped(this.getInfo))
      .get('/search/:name', wrapped(this.search));
  }

  private getAll: RequestHandler = async (req, res) => {
    const products = await this.service.getAll();
    res.status(200).json(products);
  };

  private getInfo: RequestHandler = async (req, res) => {
    const params = validateSchema(idReqSchema, req.params);
    const product = await this.service.getInfo(params.id);
    res.status(200).json(product);
  };

  private search: RequestHandler = async (req, res) => {
    const params = validateSchema(productReqSchema, req.params);
    const products = await this.service.search(params.name);
    res.status(200).json(products);
  };
}
