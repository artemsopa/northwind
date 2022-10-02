import {
  NextFunction, Request, Response, Router,
} from 'express';
import { ISuppliersService } from '../../services/services';
import { idReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';

class SuppliersRoute {
  constructor(private suppliersService: ISuppliersService) {
    this.suppliersService = suppliersService;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this))
      .get('/:id', this.getInfo.bind(this));
  }

  private async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = await this.suppliersService.getAll();
      res.status(200).json(suppliers);
    } catch (error) {
      next(error);
    }
  }

  private async getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateSchema(idReqSchema, req.params);
      const supplier = await this.suppliersService.getInfo(params.id);
      res.status(200).json(supplier);
    } catch (error) {
      next(error);
    }
  }
}

export default SuppliersRoute;
