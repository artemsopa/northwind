import { Detail, Order, Product } from '@prisma/client';

export type OrderJoinDetail = Order & {
    details: Detail[];
}

export type DetailJoinProductJoinOrder = Detail & {
    product: Product;
    order: Order;
}
