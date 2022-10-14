import express, { Application } from 'express';
import cors from 'cors';
import errors from '@/middlewares/errors';
import notFound from '@/middlewares/notfound';
import { Controller } from './controllers/controller';

export class App {
  private readonly app: Application;
  constructor(private readonly port: number = 5000, ...controllers: Controller[]) {
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

    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });

    this.app
      .use(errors)
      .use(notFound);
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server successfully started on http://127.0.0.1:${this.port}...`);
    });
  }
}
