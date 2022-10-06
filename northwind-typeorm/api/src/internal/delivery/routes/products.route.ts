import {
  NextFunction, Request, Response, Router,
} from 'express';
import { idReqSchema, productReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';
import { IProductsService } from '../../services/services';

class ProductsRoute {
  constructor(private readonly productsService: IProductsService) {
    this.productsService = productsService;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this))
      .get('/:id', this.getInfo.bind(this))
      .get('/search/:name', this.search.bind(this));
  }

  private async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productsService.getAll();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  private async getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateSchema(idReqSchema, req.params);
      const product = await this.productsService.getInfo(params.id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  private async search(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateSchema(productReqSchema, req.params);
      const products = await this.productsService.search(params.name);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
}

export default ProductsRoute;
