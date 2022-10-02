import { ICustomersService } from './services';
import { ICustomersRepo } from '../repositories/repositories';
import { CustomerItem, CustomerInfo } from './dtos/customer';
import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { EnqueuedMetric } from './dtos/metric';

class CustomersService implements ICustomersService {
  constructor(private customersRepo: ICustomersRepo, private queue: ISQSQueue) {
    this.customersRepo = customersRepo;
    this.queue = queue;
  }

  async getAll(): Promise<CustomerItem[]> {
    const prevMs = Date.now();
    const { customers, query, type } = await this.customersRepo.getAll();
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const items = customers.map((item) => new CustomerItem(
      item.id,
      item.companyName,
      item.contactName,
      item.contactTitle,
      item.city,
      item.country,
    ));
    return items;
  }

  async getInfo(id: string): Promise<CustomerInfo> {
    const prevMs = Date.now();
    const { customer, query, type } = await this.customersRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    if (!customer) throw ApiError.badRequest('Unknown customer!');
    const item = new CustomerInfo(
      customer.id,
      customer.companyName,
      customer.contactName,
      customer.contactTitle,
      customer.address,
      customer.city,
      customer.postalCode,
      customer.region,
      customer.country,
      customer.phone,
      customer.fax,
    );
    return item;
  }

  async search(company: string): Promise<CustomerItem[]> {
    const prevMs = Date.now();
    const { customers, query, type } = await this.customersRepo.search(company);
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const items = customers.map((item) => new CustomerItem(
      item.id,
      item.companyName,
      item.contactName,
      item.contactTitle,
      item.city,
      item.country,
    ));
    return items;
  }
}

export default CustomersService;
