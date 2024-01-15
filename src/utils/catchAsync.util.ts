import { Request, Response, NextFunction } from "express";

/**
 * Wraps an asynchronous route handler with error handling middleware.
 *
 * @param {function} fn - Asynchronous route handler function.
 * @returns {function} - Express middleware function.
 * @throws {Error} - Propagates errors to the Express error handling middleware.
 */
export default (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => next(err));
  };
};
