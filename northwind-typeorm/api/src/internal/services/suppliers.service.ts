import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { ISuppliersRepo } from '../repositories/repositories';
import { EnqueuedMetric } from './dtos/metric';
import { SupplierItem, SupplierInfo } from './dtos/supplier';
import { ISuppliersService } from './services';

class SuppliersService implements ISuppliersService {
  constructor(private readonly suppliersRepo: ISuppliersRepo, private readonly queue: ISQSQueue) {
    this.suppliersRepo = suppliersRepo;
    this.queue = queue;
  }

  async getAll(): Promise<SupplierItem[]> {
    const prevMs = Date.now();
    const { data, query, type } = await this.suppliersRepo.getAll();
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const suppliers = data.map((item) => new SupplierItem(
      item.id,
      item.companyName,
      item.contactName,
      item.contactTitle,
      item.city,
      item.country,
    ));
    return suppliers;
  }

  async getInfo(id: string): Promise<SupplierInfo> {
    const prevMs = Date.now();
    const { data, query, type } = await this.suppliersRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    if (!data) throw ApiError.badRequest('Unknown supplier!');

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const supplier = new SupplierInfo(
      data.id,
      data.companyName,
      data.contactName,
      data.contactTitle,
      data.address,
      data.city,
      data.region,
      data.postalCode,
      data.country,
      data.phone,
    );
    return supplier;
  }
}

export default SuppliersService;
