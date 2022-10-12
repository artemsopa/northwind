export class ErrorApi extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  static badRequest = (message: string) => new ErrorApi(400, `Bad request. ${message}`);
}
