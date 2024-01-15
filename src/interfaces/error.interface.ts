/**
 * Interface representing a custom error with additional properties.
 *
 * @interface IError
 * @extends Error
 * @property {number} [statusCode] - The HTTP status code associated with the error.
 * @property {string} [status] - The status (either "fail" or "error") based on the statusCode.
 * @property {boolean} [isOperational] - Indicates whether the error is operational.
 */
export interface IError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}
