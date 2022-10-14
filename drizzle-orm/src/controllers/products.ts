import { RequestHandler } from 'express';
import { ProductsService } from '@/services/products';
import { Controller, wrapped } from '@/app';
import { idSchema, productSchema } from '@/zod-schemas/schemas';

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
    const params = idSchema.parse(req.params);
    const product = await this.service.getInfo(String(params.id));
    res.status(200).json(product);
  };

  private search: RequestHandler = async (req, res) => {
    const params = productSchema.parse(req.params);
    const products = await this.service.search(params.name);
    res.status(200).json(products);
  };
}
