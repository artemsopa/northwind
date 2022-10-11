import {
  NextFunction, Request, Response, Router,
} from 'express';
import { SuppliersService } from 'src/internal/services/suppliers.service';
import { idReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';

export class SuppliersRoute {
  constructor(private readonly service: SuppliersService) {
    this.service = service;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this))
      .get('/:id', this.getInfo.bind(this));
  }

  private async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = await this.service.getAll();
      res.status(200).json(suppliers);
    } catch (error) {
      next(error);
    }
  }

  private async getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateSchema(idReqSchema, req.params);
      const supplier = await this.service.getInfo(params.id);
      res.status(200).json(supplier);
    } catch (error) {
      next(error);
    }
  }
}
