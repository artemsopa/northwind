import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { IEmployeesRepo } from '../repositories/repositories';
import { EmployeeItem, EmployeeInfo, EmployeeRecipient } from './dtos/employee';
import { EnqueuedMetric } from './dtos/metric';
import { IEmployeesService } from './services';

class EmployeesService implements IEmployeesService {
  constructor(private readonly employeesRepo: IEmployeesRepo) {
    this.employeesRepo = employeesRepo;
  }

  async getAll(): Promise<EmployeeItem[]> {
    const prevMs = Date.now();
    const { data, query, type } = await this.employeesRepo.getAll();
    const currMs = Date.now() - prevMs;

    // const metric = new EnqueuedMetric(query, currMs, type);
    // await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const employees = data.map((item) => new EmployeeItem(
      item.id,
      item.first_name,
      item.last_name,
      item.title,
      item.city,
      item.home_phone,
      item.country,
    ));
    return employees;
  }

  async getInfo(id: string): Promise<EmployeeInfo> {
    const prevMs = Date.now();
    const { data, query, type } = await this.employeesRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    if (data === undefined) throw ApiError.badRequest('Unknown employee!');

    // const metric = new EnqueuedMetric(query, currMs, type);
    // await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const employee = new EmployeeInfo(
      data.id,
      data.first_name,
      data.last_name,
      data.title,
      data.title_of_courtesy,
      data.birth_date,
      data.hire_date,
      data.address,
      data.city,
      data.postal_code,
      data.country,
      data.home_phone,
      data.extension,
      data.notes,
      new EmployeeRecipient(
        data.e_id,
        data.e_first_name,
        data.e_last_name,
      ),
    );
    return employee;
  }
}

export default EmployeesService;
