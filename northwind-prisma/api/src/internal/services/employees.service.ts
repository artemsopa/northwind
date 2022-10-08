import ApiError from '../../pkg/error/api.error';
import { IEmployeesRepo } from '../repositories/repositories';
import { EmployeeItem, EmployeeInfo, EmployeeRecipient } from './dtos/employee';
import { IEmployeesService } from './services';

class EmployeesService implements IEmployeesService {
  constructor(private readonly employeesRepo: IEmployeesRepo) {
    this.employeesRepo = employeesRepo;
  }

  async getAll(): Promise<EmployeeItem[]> {
    const data = await this.employeesRepo.getAll();

    const employees = data.map((item) => new EmployeeItem(
      item.id,
      item.firstName,
      item.lastName,
      item.title,
      item.city,
      item.homePhone,
      item.country,
    ));
    return employees;
  }

  async getInfo(id: string): Promise<EmployeeInfo> {
    const data = await this.employeesRepo.getInfo(id);

    if (!data) throw ApiError.badRequest('Unknown employee!');

    const employee = new EmployeeInfo(
      data.id,
      data.firstName,
      data.lastName,
      data.title,
      data.titleOfCourtesy,
      data.birthDate,
      data.hireDate,
      data.address,
      data.city,
      data.postalCode,
      data.country,
      data.homePhone,
      data.extension,
      data.notes,
      data.recipient ? new EmployeeRecipient(
        data.recipient.id,
        data.recipient.firstName,
        data.recipient.lastName,
      ) : null,
    );
    return employee;
  }
}

export default EmployeesService;
