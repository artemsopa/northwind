import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

export enum QueryTypes {
  SELECT = 'SELECT',
  SELECT_WHERE = 'SELECT WHERE',
  SELECT_LEFT_JOIN = 'SELECT LEFT JOIN',
  SELECT_LEFT_JOIN_WHERE = 'SELECT LEFT JOIN WHERE'
}

@Entity({ name: 'metrics' })
export default class Metric {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'longtext', name: 'query' })
    query: string;

  @Column({
    type: 'decimal', name: 'ms', precision: 10, default: 0,
  })
    ms: number;

  @Column({ type: 'enum', enum: QueryTypes, default: QueryTypes.SELECT })
    type: QueryTypes;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

  constructor(
    query: string,
    ms: number,
    type: QueryTypes,
  ) {
    this.query = query;
    this.ms = ms;
    this.type = type;
  }
}
