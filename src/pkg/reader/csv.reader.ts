import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import {
  Customer, Employee, Order, OrderDetail, Product, Supply, Files,
} from './types.reader';

export default class CSVReader {
  constructor(private readonly filePath: string) {
    this.filePath = filePath;
  }

  private readCSV = <T>(fileName: string) => new Promise<T[]>(
    (resolve, reject) => {
      const result: T[] = [];
      fs.createReadStream(path.resolve(__dirname, this.filePath, fileName), { encoding: 'utf-8' })
        .pipe(csv())
        .on('data', (data: T) => result.push(data))
        .on('error', (err) => reject(err))
        .on('end', () => resolve(result));
    },
  );

  readAllCSVs = async () => {
    const employees = await this.readCSV<Employee>(Files.Employees);
    const customers = await this.readCSV<Customer>(Files.Customers);
    const orders = await this.readCSV<Order>(Files.Orders);
    const supplies = await this.readCSV<Supply>(Files.Supplies);
    const products = await this.readCSV<Product>(Files.Products);
    const orderDetails = await this.readCSV<OrderDetail>(Files.OrderDetails);

    return {
      employees, customers, orders, supplies, products, orderDetails,
    };
  };
}
