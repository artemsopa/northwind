export class Service {
  public readonly host: string;
  public constructor(public readonly path: string, host: string) {
    this.path = path;
    this.host = `http://${host}`;
  }
}
