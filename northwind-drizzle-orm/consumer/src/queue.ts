import AWS from 'aws-sdk';

export class Queue {
  constructor(private readonly client: AWS.SQS, private readonly url: string) {
    this.client = client;
    this.url = url;
  }

  async deleteMessages(deleteMessageRequests: any[]): Promise<void> {
    if (deleteMessageRequests.length <= 0) {
      return;
    }

    const result = await this.client
      .deleteMessageBatch({
        QueueUrl: this.url,
        Entries: deleteMessageRequests.map((m) => ({
          Id: m.id,
          ReceiptHandle: m.receiptHandle,
        })),
      })
      .promise();

    if (result.Failed.length > 0) {
      throw new Error('Unable to delete messages from the queue.');
    }
  }
}
