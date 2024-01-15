/**
 * Custom error class for handling application-specific errors.
 *
 * @class AppError
 * @extends Error
 * @param {string} message - The error message.
 * @param {number} statusCode - The HTTP status code associated with the error.
 * @property {number} statusCode - The HTTP status code associated with the error.
 * @property {string} status - The status (either "fail" or "error") based on the statusCode.
 * @property {boolean} isOperational - Indicates whether the error is operational.
 */
class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
