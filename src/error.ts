export class CloudError extends Error {
  public code: string;

  constructor(code, message) {
    super(message);
    this.name = "CloudError";
    this.code = code;
  }
}
