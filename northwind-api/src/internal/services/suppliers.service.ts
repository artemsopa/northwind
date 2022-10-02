import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { ISuppliersRepo } from '../repositories/repositories';
import { EnqueuedMetric } from './dtos/metric';
import { SupplierItem, SupplierInfo } from './dtos/supplier';
import { ISuppliersService } from './services';

class SuppliersService implements ISuppliersService {
  constructor(private suppliersRepo: ISuppliersRepo, private queue: ISQSQueue) {
    this.suppliersRepo = suppliersRepo;
    this.queue = queue;
  }

  async getAll(): Promise<SupplierItem[]> {
    const prevMs = Date.now();
    const { suppliers, query, type } = await this.suppliersRepo.getAll();
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const items = suppliers.map((item) => new SupplierItem(
      item.id,
      item.companyName,
      item.contactName,
      item.contactTitle,
      item.city,
      item.country,
    ));
    return items;
  }

  async getInfo(id: string): Promise<SupplierInfo> {
    const prevMs = Date.now();
    const { supplier, query, type } = await this.suppliersRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    if (!supplier) throw ApiError.badRequest('Unknown supplier!');
    const item = new SupplierInfo(
      supplier.id,
      supplier.companyName,
      supplier.contactName,
      supplier.contactTitle,
      supplier.address,
      supplier.city,
      supplier.region,
      supplier.postalCode,
      supplier.country,
      supplier.phone,
    );
    return item;
  }
}

export default SuppliersService;
