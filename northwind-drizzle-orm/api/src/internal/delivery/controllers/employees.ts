import { RequestHandler } from 'express';
import { EmployeesService } from '@/internal/services/employees';
import { Controller, wrapped } from '../app';
import { idReqSchema } from './joi-schemas/req.schema';
import validateSchema from './joi-schemas/schema';

export class EmployeesController extends Controller {
  constructor(private readonly service: EmployeesService) {
    super('/employees');
    this.service = service;
    this.router
      .get('/', wrapped(this.getAll))
      .get('/:id', wrapped(this.getInfo));
  }

  private getAll: RequestHandler = async (req, res) => {
    const employees = await this.service.getAll();
    res.status(200).json(employees);
  };

  private getInfo: RequestHandler = async (req, res) => {
    const params = validateSchema(idReqSchema, req.params);
    const employee = await this.service.getInfo(params.id);
    res.status(200).json(employee);
  };
}
