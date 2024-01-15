import { Request, Response, NextFunction } from "express";
import { IError } from "./../interfaces/error.interface";
import AppError from "./../utils/appError.util";

/**
 * Creates an AppError for invalid JWT during login.
 *
 * @returns {AppError} AppError instance with an error message and status code.
 */
const handleJWTError = () =>
  new AppError("Invalid Login, Please logIn again!", 401);

/**
 * Creates an AppError for expired JWT during login.
 *
 * @returns {AppError} AppError instance with an error message and status code.
 */
const handleJWTExpiredError = () =>
  new AppError("You token has expired! Please log in again.", 401);

/**
 * Sends detailed error response in development environment.
 *
 * @function sendErrorDev
 * @param {IError} err - The error object.
 * @param {Response} res - Express response object.
 * @returns {void}
 */
const sendErrorDev = (err: IError, res: Response) => {
  res.status(err.statusCode as number).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Sends simplified error response in production environment.
 *
 * @function sendErrorProd
 * @param {IError} err - The error object.
 * @param {Response} res - Express response object.
 * @returns {void}
 */
const sendErrorProd = (err: IError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode as number).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("Error 💥", err); // Log the error in production
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

/**
 * Express middleware for handling errors and sending appropriate responses.
 *
 * @function globalErrorHandler
 * @param {IError} err - The error object.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {void}
 */
export default (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let errorCopy = { ...err, message: err.message };
    let error = JSON.parse(JSON.stringify(errorCopy));

    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};
