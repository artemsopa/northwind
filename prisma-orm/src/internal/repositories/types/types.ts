import { Detail, Employee, Order, Product, Supplier } from '@prisma/client';

export type EmployeeJoinRecipient = Employee & {
    recipient: Employee | null;
}

export type OrderJoinDetail = Order & {
    details: Detail[];
}

export type DetailJoinProductJoinOrder = Detail & {
    product: Product;
    order: Order;
}

export type ProductJoinSupplier = Product & {
    supplier: Supplier;
}
