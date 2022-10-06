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

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const products = data.map((item) => new ProductItem(
      item.id,
      item.name,
      item.quantityPerUnit,
      item.unitPrice,
      item.unitsInStock,
      item.unitsOnOrder,
    ));
    return products;
  }

  async getInfo(id: string): Promise<ProductInfo> {
    const prevMs = Date.now();
    const { data, query, type } = await this.productsRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    if (!data || !data.products || !data.suppliers) throw ApiError.badRequest('Unknown product!');
    const item = new ProductInfo(
      data.products.id,
      data.products.name,
      data.products.quantityPerUnit,
      data.products.unitPrice,
      data.products.unitsInStock,
      data.products.unitsOnOrder,
      data.products.reorderLevel,
      data.products.discontinued,
      new ProductSupplier(
        data.suppliers.id,
        data.suppliers.companyName,
      ),
    );
    return item;
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
      item.quantityPerUnit,
      item.unitPrice,
      item.unitsInStock,
      item.unitsOnOrder,
    ));
    return products;
  }
}

export default ProductsService;
