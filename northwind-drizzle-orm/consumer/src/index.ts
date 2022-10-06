import { SQSEvent } from 'aws-lambda';
import app from './app/app';

export const consumer = async (event: SQSEvent) => (await app).handle(event);
