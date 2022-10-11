import { RequestHandler } from 'express';
import { CustomersService } from '@/internal/services/cutomers';
import { Controller, wrapped } from '@/internal/delivery/app';
import { idReqSchema, customerReqSchema } from '@/internal/delivery/controllers/joi-schemas/req.schema';
import validateSchema from '@/internal/delivery/controllers/joi-schemas/schema';

export class CustomersController extends Controller {
  constructor(private readonly service: CustomersService) {
    super('/customers');
    this.service = service;
    this.router
      .get('/', wrapped(this.getAll))
      .get('/:id', wrapped(this.getInfo))
      .get('/search/:company', wrapped(this.search));
  }

  private getAll: RequestHandler = async (req, res) => {
    const customers = await this.service.getAll();
    res.status(200).json(customers);
  };

  private getInfo: RequestHandler = async (req, res) => {
    const params = validateSchema(idReqSchema, req.params);
    const customer = await this.service.getInfo(params.id);
    res.status(200).json(customer);
  };

  private search: RequestHandler = async (req, res) => {
    const params = validateSchema(customerReqSchema, req.params);
    const customer = await this.service.search(params.company);
    res.status(200).json(customer);
  };
}
