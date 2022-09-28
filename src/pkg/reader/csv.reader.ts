import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import {
  Customer, Employee, Files, Order, OrderDetail, Product, Supply,
} from './types.reader';

export default class CsvReader {
  constructor(private readonly filePath: string) {
    this.filePath = filePath;
  }

  private readFile = <T>(fileName: string) => new Promise<T[]>(
    (resolve, reject) => {
      const result: T[] = [];
      fs.createReadStream(path.resolve(__dirname, this.filePath, fileName), { encoding: 'utf-8' })
        .pipe(csv())
        .on('data', (data: T) => result.push(data))
        .on('error', (err) => reject(err))
        .on('end', () => resolve(result));
    },
  );

  readAllFiles = async () => {
    const employees = await this.readFile<Employee>(Files.Employees);
    const customers = await this.readFile<Customer>(Files.Customers);
    const orders = await this.readFile<Order>(Files.Orders);
    const supplies = await this.readFile<Supply>(Files.Supplies);
    const products = await this.readFile<Product>(Files.Products);
    const orderDetails = await this.readFile<OrderDetail>(Files.OrderDetails);

    return {
      employees, customers, orders, supplies, products, orderDetails,
    };
  };
}
