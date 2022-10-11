import {
  NextFunction, Request, Response, Router,
} from 'express';
import { EmployeesService } from 'src/internal/services/employees.service';
import { idReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';

export class EmployeesRoute {
  constructor(private readonly service: EmployeesService) {
    this.service = service;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this))
      .get('/:id', this.getInfo.bind(this));
  }

  private async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const employees = await this.service.getAll();
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  }

  private async getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateSchema(idReqSchema, req.params);
      const employee = await this.service.getInfo(params.id);
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  }
}
