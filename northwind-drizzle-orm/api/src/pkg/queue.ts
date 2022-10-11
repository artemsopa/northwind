import AWS from 'aws-sdk';

export class Queue {
  constructor(private readonly client: AWS.SQS, private readonly url: string) {
    this.client = client;
    this.url = url;
  }

  async enqueueMessage<T>(message: T): Promise<void> {
    await this.client
      .sendMessage({
        QueueUrl: this.url,
        MessageBody: JSON.stringify(message),
      })
      .promise();
  }
}
