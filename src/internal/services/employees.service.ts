import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { IEmployeesRepo } from '../repositories/repositories';
import { EmployeeItem, EmployeeInfo, EmployeeRecipient } from './dtos/employee';
import { EnqueuedMetric } from './dtos/metric';
import { IEmployeesService } from './services';

class EmployeesService implements IEmployeesService {
  constructor(private employeesRepo: IEmployeesRepo, private queue: ISQSQueue) {
    this.employeesRepo = employeesRepo;
    this.queue = queue;
  }

  async getAll(): Promise<EmployeeItem[]> {
    const prevMs = Date.now();
    const { employees, query, type } = await this.employeesRepo.getAll();
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const items = employees.map((item) => new EmployeeItem(
      item.id,
      item.firstName,
      item.lastName,
      item.title,
      item.city,
      item.homePhone,
      item.country,
    ));
    return items;
  }

  async getInfo(id: string): Promise<EmployeeInfo> {
    const prevMs = Date.now();
    const { employee, query, type } = await this.employeesRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    if (!employee) throw ApiError.badRequest('Unknown employee!');
    const item = new EmployeeInfo(
      employee.id,
      employee.firstName,
      employee.lastName,
      employee.title,
      employee.titleOfCourtesy,
      employee.birthDate,
      employee.hireDate,
      employee.address,
      employee.city,
      employee.postalCode,
      employee.country,
      employee.homePhone,
      employee.extension,
      employee.notes,
      new EmployeeRecipient(
        employee.recipient.id,
        employee.recipient.firstName,
        employee.recipient.lastName,
      ),
    );
    return item;
  }
}

export default EmployeesService;
