import { ICustomersService } from './services';
import { ICustomersRepo } from '../repositories/repositories';
import { CustomerItem, CustomerInfo } from './dtos/customer';
import ApiError from '../../pkg/error/api.error';

class CustomersService implements ICustomersService {
  constructor(private readonly customersRepo: ICustomersRepo) {
    this.customersRepo = customersRepo;
  }

  async getAll(): Promise<CustomerItem[]> {
    const data = await this.customersRepo.getAll();

    const customers = data.map((item) => new CustomerItem(
      item.id,
      item.companyName,
      item.contactName,
      item.contactTitle,
      item.city,
      item.country,
    ));
    return customers;
  }

  async getInfo(id: string): Promise<CustomerInfo> {
    const data = await this.customersRepo.getInfo(id);

    if (!data) throw ApiError.badRequest('Unknown customer!');

    const customer = new CustomerInfo(
      data.id,
      data.companyName,
      data.contactName,
      data.contactTitle,
      data.address,
      data.city,
      data.postalCode,
      data.region,
      data.country,
      data.phone,
      data.fax,
    );
    return customer;
  }

  async search(company: string): Promise<CustomerItem[]> {
    const data = await this.customersRepo.search(company);

    const customers = data.map((item) => new CustomerItem(
      item.id,
      item.companyName,
      item.contactName,
      item.contactTitle,
      item.city,
      item.country,
    ));
    return customers;
  }
}

export default CustomersService;
