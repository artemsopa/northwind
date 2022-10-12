import express, { Application } from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import notFound from '@/internal/nfound';
import { Service } from './service';

export class App {
  private readonly app: Application;
  constructor(private readonly port: number = 8000, ...services: Service[]) {
    this.app = express()
      .use(express.json())
      .use(express.raw({
        inflate: true,
        limit: '100kb',
        type: () => true,
      }))
      .use(cors({
        origin: '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        optionsSuccessStatus: 204,
      }));

    services.forEach((service) => {
      this.app.use(service.path, proxy(service.host));
    });

    this.app
      .use(notFound);
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server has been started on http://127.0.0.1:${this.port}...`);
    });
  }
}
