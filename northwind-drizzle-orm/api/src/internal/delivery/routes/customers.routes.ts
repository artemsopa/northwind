import {
  NextFunction, Request, Response, Router,
} from 'express';
import { CustomersService } from 'src/internal/services/cutomers.service';
import { idReqSchema, customerReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';

export class CustomersRoute {
  constructor(private readonly service: CustomersService) {
    this.service = service;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this))
      .get('/:id', this.getInfo.bind(this))
      .get('/search/:company', this.search.bind(this));
  }

  private async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const customers = await this.service.getAll();
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  }

  private async getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateSchema(idReqSchema, req.params);
      const customer = await this.service.getInfo(params.id);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  }

  private async search(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateSchema(customerReqSchema, req.params);
      const customer = await this.service.search(params.company);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  }
}
