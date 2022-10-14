import { RequestHandler, Router } from 'express';

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
