import { IProductsService } from './services';
import { IProductsRepo } from '../repositories/repositories';
import { ProductItem, ProductInfo, ProductSupplier } from './dtos/product';
import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { EnqueuedMetric } from './dtos/metric';

class ProductsService implements IProductsService {
  constructor(private readonly productsRepo: IProductsRepo, private readonly queue: ISQSQueue) {
    this.productsRepo = productsRepo;
    this.queue = queue;
  }

  async getAll(): Promise<ProductItem[]> {
    const prevMs = Date.now();
    const { data, query, type } = await this.productsRepo.getAll();
    const currMs = Date.now() - prevMs;

    // const metric = new EnqueuedMetric(query, currMs, type);
    // await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const products = data.map((item) => new ProductItem(
      item.id,
      item.name,
      item.qt_per_unit,
      item.unit_price,
      item.units_in_stock,
      item.units_on_order,
    ));
    return products;
  }

  async getInfo(id: string): Promise<ProductInfo> {
    const prevMs = Date.now();
    const { data, query, type } = await this.productsRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    if (data === undefined) throw ApiError.badRequest('Unknown product!');

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const product = new ProductInfo(
      data.id,
      data.name,
      data.qt_per_unit,
      data.unit_price,
      data.units_in_stock,
      data.units_on_order,
      data.reorder_level,
      data.discontinued,
      data.s_id ? new ProductSupplier(
        data.s_id,
        data.s_company_name,
      ) : null,
    );
    return product;
  }

  async search(name: string): Promise<ProductItem[]> {
    const prevMs = Date.now();
    const { data, query, type } = await this.productsRepo.search(name);
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const products = data.map((item) => new ProductItem(
      item.id,
      item.name,
      item.qt_per_unit,
      item.unit_price,
      item.units_in_stock,
      item.units_on_order,
    ));
    return products;
  }
}

export default ProductsService;
