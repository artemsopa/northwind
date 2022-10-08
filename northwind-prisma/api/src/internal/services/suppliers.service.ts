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
    const data = await this.suppliersRepo.getAll();

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
    const data = await this.suppliersRepo.getInfo(id);

    if (!data) throw ApiError.badRequest('Unknown supplier!');

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
