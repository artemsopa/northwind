export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  static badRequest = (message: string) => new ApiError(400, `Bad request. ${message}`);
}
