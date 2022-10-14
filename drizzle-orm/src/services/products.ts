import { eq, ilike } from 'drizzle-orm/expressions';
import { ApiError } from '@/error';
import { products as table } from '@/entities/products';
import { Database } from '@/entities/schema';
import { suppliers } from '@/entities/suppliers';

export class ProductsService {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.products.select().execute();

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
    const [data] = await this.db.products.select()
      .leftJoin(suppliers, eq(table.supplierId, suppliers.id))
      .where(eq(table.id, id))
      .execute();

    if (!data || !data.products || !data.suppliers) throw ApiError.badRequest('Unknown product!');

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
    const data = await this.db.products.select()
      .where(ilike(table.name, `%${name}%`))
      .execute();

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
