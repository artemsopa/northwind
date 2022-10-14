import { RequestHandler } from 'express';
import { CustomersService } from '@/services/cutomers';
import { Controller, wrapped } from '@/controllers/controller';
import { idSchema, customerSchema } from '@/validation/schemas';

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
    const params = idSchema.parse(req.params);
    const customer = await this.service.getInfo(String(params.id));
    res.status(200).json(customer);
  };

  private search: RequestHandler = async (req, res) => {
    const params = customerSchema.parse(req.params);
    const customer = await this.service.search(params.company);
    res.status(200).json(customer);
  };
}
