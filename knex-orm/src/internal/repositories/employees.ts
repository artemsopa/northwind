import { Knex } from 'knex';

export class EmployeesRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll() {
    const data = await this.knex('public.employees').select();

    return data;
  }

  async getInfo(id: string) {
    const [data] = await this.knex('public.employees as e1')
      .whereRaw('e1.id = (?)', [id])
      .leftJoin(
        'public.employees as e2',
        'e1.recipient_id',
        'e2.id',
      )
      .select(['e1.*', 'e2.id as e_id', 'e2.last_name as e_last_name', 'e2.first_name as e_first_name']);

    return data;
  }
}
