import express, { Application, RequestHandler, Router } from 'express';
import cors from 'cors';
import errors from '@/middlewares/errors';
import notFound from '@/middlewares/notfound';

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

export abstract class Controller {
  public readonly path: string;
  public readonly router: Router;

  public constructor(path: string) {
    this.path = path;
    this.router = Router();
  }
}

export const wrapped = (callback: any): RequestHandler => async (req, res, next) => {
  try {
    await callback(req, res, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  static badRequest = (message: string) => new ApiError(400, `Bad request. ${message}`);
}
