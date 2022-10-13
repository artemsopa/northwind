import { ErrorApi } from '@/pkg/error';
import { OrdersRepo } from '@/internal/repositories/orders';

export class OrdersService {
  constructor(private readonly repo: OrdersRepo) {
    this.repo = repo;
  }

  async getAll() {
    const data = await this.repo.getAll();

    const orders = data.map((item) => ({
      id: item.id,
      totalPrice: item.details.reduce((sum, curr) => sum + curr.quantity * Number(curr.unitPrice), 0),
      products: item.details.length || 0,
      quantity: item.details.reduce((sum, curr) => sum + curr.quantity, 0),
      shppedDate: item.shippedDate,
      shipName: item.shipName,
      shipCity: item.shipCity,
      shipCountry: item.shipCountry,
    }));
    return orders;
  }

  async getInfo(id: string) {
    const data = await this.repo.getInfo(id);

    const [{ order }] = data;
    if (!order) throw ErrorApi.badRequest('Unknown order!');

    const map = new Map();
    for (const el of data) {
      if (el && el.product) {
        map.set(
          { order: el.order.id, product: el.product.id },
          ({
            id: el.product.id,
            name: el.product.name,
            quantity: el.quantity,
            orderPrice: Number(el.unitPrice),
            totalPrice: el.quantity * Number(el.unitPrice),
            discount: Number(el.discount),
          }),
        );
      }
    }

    const products = Array.from(map, ([name, value]) => (value));

    const info = ({
      id: order.id,
      shipName: order.shipName,
      totalProducts: products.length || 0,
      totalQuantity: products.reduce((sum, curr) => sum + curr.quantity, 0),
      totalPrice: products.reduce((sum, curr) => sum + curr.totalPrice, 0),
      totalDiscount: products.reduce((sum, curr) => sum + curr.discount, 0),
      shipVia: order.shipVia,
      freight: Number(order.freight),
      orderDate: order.orderDate,
      requiredDate: order.requiredDate,
      shippedDate: order.shippedDate,
      shipCity: order.shipCity,
      shipRegion: order.shipRegion,
      shipPostalCode: order.shipPostalCode,
      shipCountry: order.shipCountry,
      customerId: order.customerId,
      products,
    });
    return info;
  }
}