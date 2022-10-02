import { SQSEvent } from 'aws-lambda';
import Repositories from '../repositories/repositories';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import ConsumerService from './consumer.service';

export interface IConsumerService {
  handle(event: SQSEvent): Promise<void>;
}

export class Deps {
  queue: ISQSQueue;
  repos: Repositories;
  constructor(repos: Repositories, queue: ISQSQueue) {
    this.queue = queue;
    this.repos = repos;
  }
}

export default class Services {
  cuonsumer: IConsumerService;
  constructor(deps: Deps) {
    this.cuonsumer = new ConsumerService(deps.repos.metrics, deps.queue);
  }
}
