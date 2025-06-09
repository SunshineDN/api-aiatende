export default class CustomError extends Error {
  constructor({ message, statusCode, lead_id = null } = {}) {
    super(message);
    this.statusCode = statusCode;
    this.lead_id = lead_id;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}