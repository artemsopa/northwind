export default class ApiError extends Error {
  status: number;
  errors: any[];

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest = (message: string) => new ApiError(400, `Bad request. ${message}`);
  static internal = () => new ApiError(500, 'Internal server error!');
}
