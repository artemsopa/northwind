import {
  Entity, Column, ManyToOne, JoinColumn, OneToMany, PrimaryColumn,
} from 'typeorm';
import Supplier from './supplier';
import Detail from './detail';

@Entity({ name: 'products' })
export default class Product {
  @PrimaryColumn()
    id: string;

  @Column({ name: 'name' })
    name: string;

  @Column({ name: 'qt_per_unit' })
    quantityPerUnit: string;

  @Column({
    name: 'unit_price', type: 'decimal', precision: 10, scale: 2, default: 0,
  })
    unitPrice: number;

  @Column({ name: 'units_in_stock' })
    unitsInStock: number;

  @Column({ name: 'units_on_order' })
    unitsOnOrder: number;

  @Column({ name: 'reorder_level' })
    reorderLevel: number;

  @Column({ name: 'discontinued' })
    discontinued: number;

  @Column({ name: 'supplier_id' })
    supplierId: string;
  @ManyToOne(() => Supplier, (supplier) => supplier.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

  @OneToMany(() => Detail, (detail) => detail.product)
    details: Detail[];

  constructor(
    id: string,
    name: string,
    quantityPerUnit: string,
    unitPrice: number,
    unitsInStock: number,
    unitsOnOrder: number,
    reorderLevel: number,
    discontinued: number,
    supplierId: string,
  ) {
    this.id = id;
    this.name = name;
    this.quantityPerUnit = quantityPerUnit;
    this.unitPrice = unitPrice;
    this.unitsInStock = unitsInStock;
    this.unitsOnOrder = unitsOnOrder;
    this.reorderLevel = reorderLevel;
    this.discontinued = discontinued;
    this.supplierId = supplierId;
  }
}
