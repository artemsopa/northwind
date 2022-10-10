export type MetricInput = {
    query: string;
    ms: number;
    type: string;
}

interface Database {
    metrics: MetricInput;
}

export default Database;
