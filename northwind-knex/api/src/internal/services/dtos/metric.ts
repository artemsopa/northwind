import { QueryTypes } from '../../repositories/types/metric';

export class MetricItem {
  query: string;
  ms: number;
  date: Date;
  constructor(
    query: string,
    ms: number,
    date: Date,
  ) {
    this.query = query;
    this.ms = ms;
    this.date = date;
  }
}

export class MetricsInfo {
  queryCount: number;
  select: number;
  selectWhere: number;
  selectJoin: number;
  selectJoinWhere: number;
  metrics: MetricItem[];
  constructor(
    queryCount: number,
    select: number,
    selectWhere: number,
    selectJoin: number,
    selectJoinWhere: number,
    metrics: MetricItem[],
  ) {
    this.queryCount = queryCount;
    this.select = select;
    this.selectWhere = selectWhere;
    this.selectJoin = selectJoin;
    this.selectJoinWhere = selectJoinWhere;
    this.metrics = metrics;
  }
}

export class EnqueuedMetric {
  query: string;
  ms: number;
  type: QueryTypes;
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
