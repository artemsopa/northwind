import {
  NextFunction, Request, Response, Router,
} from 'express';
import { ProductsService } from 'src/internal/services/products.service';
import { idReqSchema, productReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';

export class ProductsRoute {
  constructor(private readonly service: ProductsService) {
    this.service = service;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this))
      .get('/:id', this.getInfo.bind(this))
      .get('/search/:name', this.search.bind(this));
  }

  private async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.service.getAll();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  private async getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateSchema(idReqSchema, req.params);
      const product = await this.service.getInfo(params.id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  private async search(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateSchema(productReqSchema, req.params);
      const products = await this.service.search(params.name);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
}
