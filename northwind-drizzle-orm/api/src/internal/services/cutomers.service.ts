import { ICustomersService } from './services';
import { ICustomersRepo } from '../repositories/repositories';
import { CustomerItem, CustomerInfo } from './dtos/customer';
import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { EnqueuedMetric } from './dtos/metric';

class CustomersService implements ICustomersService {
  constructor(private readonly customersRepo: ICustomersRepo, private readonly queue: ISQSQueue) {
    this.customersRepo = customersRepo;
    this.queue = queue;
  }

  async getAll(): Promise<CustomerItem[]> {
    const prevMs = Date.now();
    const { data, query, type } = await this.customersRepo.getAll();
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const customers = data.map((item) => new CustomerItem(
      item.id,
      item.companyName,
      item.contactName,
      item.contactTitle,
      item.city,
      item.country,
    ));
    return customers;
  }

  async getInfo(id: string): Promise<CustomerInfo> {
    const prevMs = Date.now();
    const { data, query, type } = await this.customersRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    if (!data) throw ApiError.badRequest('Unknown customer!');
    const customer = new CustomerInfo(
      data.id,
      data.companyName,
      data.contactName,
      data.contactTitle,
      data.address,
      data.city,
      data.postalCode,
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

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const customers = data.map((item) => new CustomerItem(
      item.id,
      item.companyName,
      item.contactName,
      item.contactTitle,
      item.city,
      item.country,
    ));
    return customers;
  }
}

export default CustomersService;
