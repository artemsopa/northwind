import { Product, Supplier } from '@prisma/client';

export type ProductJoinSupplier = Product & {
    supplier: Supplier;
}
