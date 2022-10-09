import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { ISuppliersRepo } from '../repositories/repositories';
import { EnqueuedMetric } from './dtos/metric';
import { SupplierItem, SupplierInfo } from './dtos/supplier';
import { ISuppliersService } from './services';

class SuppliersService implements ISuppliersService {
  constructor(private readonly suppliersRepo: ISuppliersRepo) {
    this.suppliersRepo = suppliersRepo;
  }

  async getAll(): Promise<SupplierItem[]> {
    const prevMs = Date.now();
    const { data, query, type } = await this.suppliersRepo.getAll();
    const currMs = Date.now() - prevMs;

    // const metric = new EnqueuedMetric(query, currMs, type);
    // await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const suppliers = data.map((item) => new SupplierItem(
      item.id,
      item.company_name,
      item.contact_name,
      item.contact_title,
      item.city,
      item.country,
    ));
    return suppliers;
  }

  async getInfo(id: string): Promise<SupplierInfo> {
    const prevMs = Date.now();
    const { data, query, type } = await this.suppliersRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    if (data === undefined) throw ApiError.badRequest('Unknown supplier!');

    // const metric = new EnqueuedMetric(query, currMs, type);
    // await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const supplier = new SupplierInfo(
      data.id,
      data.company_name,
      data.contact_name,
      data.contact_title,
      data.address,
      data.city,
      data.region,
      data.postal_code,
      data.country,
      data.phone,
    );
    return supplier;
  }
}

export default SuppliersService;
