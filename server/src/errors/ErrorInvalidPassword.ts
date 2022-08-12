export class ErrorInvalidPassword extends Error {
  constructor() {
    super("Your password is incorrect");
  }
}
