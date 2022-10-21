import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'metrics' })
export class Metric {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ name: 'query', type: 'text' })
    query: string;

  @Column({ name: 'ms', type: 'integer', default: 0 })
    ms: number;

  @Column({ name: 'type', type: 'enum', enumName: 'query_type', default: 'SELECT' })
    type: 'SELECT' | 'WHERE' | 'JOIN';

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
}
