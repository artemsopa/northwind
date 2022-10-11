import { ErrorApi } from '@/pkg/error';
import { Queue } from '@/pkg/queue';
import { ProductsRepo } from '@/internal/repositories/products';

export class ProductsService {
  constructor(private readonly repo: ProductsRepo, private readonly queue: Queue) {
    this.repo = repo;
    this.queue = queue;
  }

  async getAll() {
    const { data, query, type, ms } = await this.repo.getAll();

    // await this.queue.enqueueMessage({ query, type, ms });

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.quantityPerUnit,
      unitPrice: item.unitPrice,
      unitsInStock: item.unitsInStock,
      unitsOnOrder: item.unitsOnOrder,
    }));
    return products;
  }

  async getInfo(id: string) {
    const { data, query, type, ms } = await this.repo.getInfo(id);
    if (!data || !data.products || !data.suppliers) throw ErrorApi.badRequest('Unknown product!');

    // await this.queue.enqueueMessage({ query, type, ms });

    const supplier = {
      id: data.suppliers.id,
      companyName: data.suppliers.companyName,
    };

    const item = {
      id: data.products.id,
      name: data.products.name,
      qtPerUnit: data.products.quantityPerUnit,
      unitPrice: data.products.unitPrice,
      unitsInStock: data.products.unitsInStock,
      unitsOnOrder: data.products.unitsOnOrder,
      reorderLevel: data.products.reorderLevel,
      discontinued: data.products.discontinued,
      supplier,
    };
    return item;
  }

  async search(name: string) {
    const { data, query, type, ms } = await this.repo.search(name);

    // await this.queue.enqueueMessage({ query, type, ms });

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.quantityPerUnit,
      unitPrice: item.unitPrice,
      unitsInStock: item.unitsInStock,
      unitsOnOrder: item.unitsOnOrder,
    }));
    return products;
  }
}
