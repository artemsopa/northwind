import {
  NextFunction, Request, Response, Router,
} from 'express';
import { idReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';
import { IEmployeesService } from '../../services/services';

class EmployeesRoute {
  constructor(private readonly employeesService: IEmployeesService) {
    this.employeesService = employeesService;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this))
      .get('/:id', this.getInfo.bind(this));
  }

  private async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const employees = await this.employeesService.getAll();
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  }

  private async getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateSchema(idReqSchema, req.params);
      const employee = await this.employeesService.getInfo(params.id);
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  }
}

export default EmployeesRoute;
