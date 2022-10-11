import { ErrorApi } from '@/pkg/error';
import { Queue } from '@/pkg/queue';
import { EmployeesRepo } from '@/internal/repositories/employees';

export class EmployeesService {
  constructor(private readonly repo: EmployeesRepo, private readonly queue: Queue) {
    this.repo = repo;
    this.queue = queue;
  }

  async getAll() {
    const { data, query, type, ms } = await this.repo.getAll();

    // await this.queue.enqueueMessage({ query, type, ms });

    const employees = data.map((item) => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      title: item.title,
      city: item.city,
      homePhone: item.homePhone,
      country: item.country,
    }));
    return employees;
  }

  async getInfo(id: string) {
    const { data, query, type, ms } = await this.repo.getInfo(id);
    if (!data) throw ErrorApi.badRequest('Unknown employee!');

    // await this.queue.enqueueMessage({ query, type, ms });

    const recipient = data.recipient_id ? ({
      id: data.recipient_id,
      firstName: data.reports_fname,
      lastName: data.reports_lname,
    }) : null;

    const employee = ({
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      title: data.title,
      titleOfCourtesy: data.title_of_courtesy,
      bithDate: data.birth_date,
      hireDate: data.hire_date,
      address: data.address,
      city: data.city,
      postalCode: data.postal_code,
      country: data.country,
      homePhone: data.home_phone,
      extension: data.extension,
      notes: data.notes,
      recipient,
    });
    return employee;
  }
}
