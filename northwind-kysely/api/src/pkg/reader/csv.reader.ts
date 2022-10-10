import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import {
  Customer, Employee, Order, OrderDetail, Product, Supplier, Files, ICSVReader,
} from './reader';

export default class CSVReader implements ICSVReader {
  constructor(private readonly filePath: string) {
    this.filePath = filePath;
  }

  private checkObjEmptyString = <T>(obj: T) => {
    for (const key in obj) {
      if (obj[key] === '') obj[key] = null as T[typeof key];
    }
    return obj;
  };

  readCSV = <T>(fileName: string) => new Promise<T[]>(
    (resolve, reject) => {
      const result: T[] = [];
      fs.createReadStream(path.resolve(__dirname, this.filePath, fileName), { encoding: 'utf-8' })
        .pipe(csv())
        .on('data', (data: T) => result.push(this.checkObjEmptyString<T>(data)))
        .on('error', (err) => reject(err))
        .on('end', () => resolve(result));
    },
  );

  readAllCSVs = async () => {
    const employees = await this.readCSV<Employee>(Files.Employees);
    const customers = await this.readCSV<Customer>(Files.Customers);
    const orders = await this.readCSV<Order>(Files.Orders);
    const suppliers = await this.readCSV<Supplier>(Files.Suppliers);
    const products = await this.readCSV<Product>(Files.Products);
    const orderDetails = await this.readCSV<OrderDetail>(Files.OrderDetails);

    return {
      employees, customers, orders, suppliers, products, orderDetails,
    };
  };
}
