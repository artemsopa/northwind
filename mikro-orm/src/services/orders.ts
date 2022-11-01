import { EntityManager } from '@mikro-orm/core';
import { Order } from '@/entities/orders';
import { Detail } from '@/entities/details';
import { ApiError } from '@/error';

export class OrdersService {
  constructor(private readonly em: EntityManager) {
    this.em = em;
  }

  async getAll() {
    const data = await this.em.find(
      Order,
      {},
      {
        populate: ['details'],
      },
    );
    const orders = data.map((item) => ({
      id: item.id,
      totalPrice: item.details.toArray().reduce((sum, curr) => sum + curr.quantity * Number(curr.unitPrice), 0),
      products: item.details.toArray().length || 0,
      quantity: item.details.toArray().reduce((sum, curr) => sum + curr.quantity, 0),
      shipped: item.shippedDate,
      shipName: item.shipName,
      city: item.shipCity,
      country: item.shipCountry,
    }));
    return orders;
  }

  async getInfo(id: string) {
    const data = await this.em.find(
      Detail,
      { orderId: id },
      {
        populate: ['order', 'product'],
      },
    );

    const [{ order }] = data;
    if (!order) throw ApiError.badRequest('Unknown order!');

    const map = new Map();
    for (const el of data) {
      if (el && el.product) {
        map.set(
          { order: el.order.id, product: el.product.id },
          {
            id: el.product.id,
            name: el.product.name,
            quantity: el.quantity,
            orderPrice: Number(el.unitPrice),
            totalPrice: Number(el.quantity * el.unitPrice),
            discount: el.discount,
          },
        );
      }
    }
    const products = Array.from(map, ([name, value]) => (value));
    const info = {
      id: order.id,
      shipName: order.shipName,
      totalProducts: products.length || 0,
      totalQuantity: products.reduce((sum, curr) => sum + Number(curr.quantity), 0),
      totalPrice: products.reduce((sum, curr) => sum + Number(curr.totalPrice), 0),
      totalDiscount: products.reduce((sum, curr) => sum + Number(curr.discount), 0),
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
    };
    return info;
  }
}
