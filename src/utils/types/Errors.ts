export class Errors {
  errors: string[];

  push(error: string) {
    this.errors.push(error);
  }
}
