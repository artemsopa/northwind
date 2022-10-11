import { SQSEvent } from 'aws-lambda';
import app from './app';

export const consumer = async (event: SQSEvent) => (await app).handle(event);
