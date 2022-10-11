export interface EnqueuedMetric {
  query: string,
  ms: number,
  type: 'SELECT' | 'WHERE' | 'JOIN',
}

export interface DequeuedMessage {
  id: string,
  receiptHandle: string
  metric: EnqueuedMetric,
}
