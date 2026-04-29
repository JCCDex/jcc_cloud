export class CloudError extends Error {
  public code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "CloudError";
    this.code = code;
  }
}
