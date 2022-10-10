import { Generated } from 'kysely';

export enum QueryTypes {
  SELECT = 'SELECT',
  SELECT_WHERE = 'SELECT WHERE',
  SELECT_LEFT_JOIN = 'SELECT LEFT JOIN',
  SELECT_LEFT_JOIN_WHERE = 'SELECT LEFT JOIN WHERE'
}

export type Metric = {
    id: string;
    query: string;
    ms: number;
    type: QueryTypes;
    created_at: Date;
}
