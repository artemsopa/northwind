import { Kysely } from 'kysely';
import { Database, EmployeeWithRecipient } from '@/internal/repositories/interfaces/interfaces';

export class EmployeesRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.selectFrom('employees').selectAll().execute();

    return data;
  }

  async getInfo(id: string) {
    const [data] = await this.db.selectFrom('employees as e1')
      .selectAll()
      .where('e1.id', '=', id)
      .limit(1)
      .leftJoinLateral(
        (eb) => eb.selectFrom('employees as e2')
          .select(['id as e_id', 'last_name as e_last_name', 'first_name as e_first_name'])
          .whereRef('e1.recipient_id', '=', 'e2.id')
          .as('e2'),
        (join) => join.onTrue(),
      )
      .execute();

    return data as EmployeeWithRecipient;
  }
}
