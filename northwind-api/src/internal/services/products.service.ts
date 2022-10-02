import { IProductsService } from './services';
import { IProductsRepo } from '../repositories/repositories';
import { ProductItem, ProductInfo, ProductSupplier } from './dtos/product';
import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { EnqueuedMetric } from './dtos/metric';

class ProductsService implements IProductsService {
  constructor(private productsRepo: IProductsRepo, private queue: ISQSQueue) {
    this.productsRepo = productsRepo;
    this.queue = queue;
  }

  async getAll(): Promise<ProductItem[]> {
    const prevMs = Date.now();
    const { products, query, type } = await this.productsRepo.getAll();
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const items = products.map((item) => new ProductItem(
      item.id,
      item.name,
      item.quantityPerUnit,
      item.unitPrice,
      item.unitsInStock,
      item.unitsOnOrder,
    ));
    return items;
  }

  async getInfo(id: string): Promise<ProductInfo> {
    const prevMs = Date.now();
    const { product, query, type } = await this.productsRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    if (!product) throw ApiError.badRequest('Unknown product!');
    const item = new ProductInfo(
      product.id,
      product.name,
      product.quantityPerUnit,
      product.unitPrice,
      product.unitsInStock,
      product.unitsOnOrder,
      product.reorderLevel,
      product.discontinued,
      product.supplier ? new ProductSupplier(
        product.supplier.id,
        product.supplier.companyName,
      ) : null,
    );
    return item;
  }

  async search(name: string): Promise<ProductItem[]> {
    const prevMs = Date.now();
    const { products, query, type } = await this.productsRepo.search(name);
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const items = products.map((item) => new ProductItem(
      item.id,
      item.name,
      item.quantityPerUnit,
      item.unitPrice,
      item.unitsInStock,
      item.unitsOnOrder,
    ));
    return items;
  }
}

export default ProductsService;
