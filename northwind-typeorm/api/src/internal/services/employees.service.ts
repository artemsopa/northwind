import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { IEmployeesRepo } from '../repositories/repositories';
import { EmployeeItem, EmployeeInfo, EmployeeRecipient } from './dtos/employee';
import { EnqueuedMetric } from './dtos/metric';
import { IEmployeesService } from './services';

class EmployeesService implements IEmployeesService {
  constructor(private readonly employeesRepo: IEmployeesRepo, private readonly queue: ISQSQueue) {
    this.employeesRepo = employeesRepo;
    this.queue = queue;
  }

  async getAll(): Promise<EmployeeItem[]> {
    const prevMs = Date.now();
    const { data, query, type } = await this.employeesRepo.getAll();
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

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
    const prevMs = Date.now();
    const { data, query, type } = await this.employeesRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    if (!data) throw ApiError.badRequest('Unknown employee!');

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

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
      new EmployeeRecipient(
        data.recipient.id,
        data.recipient.firstName,
        data.recipient.lastName,
      ),
    );
    return employee;
  }
}

export default EmployeesService;
