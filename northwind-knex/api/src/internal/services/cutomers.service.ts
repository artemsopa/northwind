import { ICustomersService } from './services';
import { ICustomersRepo } from '../repositories/repositories';
import { CustomerItem, CustomerInfo } from './dtos/customer';
import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { EnqueuedMetric } from './dtos/metric';

class CustomersService implements ICustomersService {
  constructor(private readonly customersRepo: ICustomersRepo) {
    this.customersRepo = customersRepo;
  }

  async getAll(): Promise<CustomerItem[]> {
    const prevMs = Date.now();
    const { data, query, type } = await this.customersRepo.getAll();
    const currMs = Date.now() - prevMs;

    // const metric = new EnqueuedMetric(query, currMs, type);
    // await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const customers = data.map((item) => new CustomerItem(
      item.id,
      item.company_name,
      item.contact_name,
      item.contact_title,
      item.city,
      item.country,
    ));
    return customers;
  }

  async getInfo(id: string): Promise<CustomerInfo> {
    const prevMs = Date.now();
    const { data, query, type } = await this.customersRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    if (data === undefined) throw ApiError.badRequest('Unknown customer!');

    // const metric = new EnqueuedMetric(query, currMs, type);
    // await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const customer = new CustomerInfo(
      data.id,
      data.company_name,
      data.contact_name,
      data.contact_title,
      data.address,
      data.city,
      data.postal_code,
      data.region,
      data.country,
      data.phone,
      data.fax,
    );
    return customer;
  }

  async search(company: string): Promise<CustomerItem[]> {
    const prevMs = Date.now();
    const { data, query, type } = await this.customersRepo.search(company);
    const currMs = Date.now() - prevMs;

    // const metric = new EnqueuedMetric(query, currMs, type);
    // await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const customers = data.map((item) => new CustomerItem(
      item.id,
      item.company_name,
      item.contact_name,
      item.contact_title,
      item.city,
      item.country,
    ));
    return customers;
  }
}

export default CustomersService;
