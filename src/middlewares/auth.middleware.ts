import { Response, NextFunction } from "express";

import AppError from "./../utils/appError.util";
import catchAsync from "./../utils/catchAsync.util";
import userModel from "./../models/user.model";
import { IUser } from "../interfaces/user.interface";
import { CustomRequest } from "./../interfaces/globalObj.interface";
import { verifyToken } from "./../utils/token.util";
import { userRole } from "../enums/user.enum";

/**
 * Middleware to protect routes by verifying and decoding JWT tokens.
 *
 * @function protect
 * @async
 * @param {CustomRequest} req - The Express Request object extended with a user property.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The Express NextFunction to pass control to the next middleware.
 * @returns {Promise<void>} A Promise that resolves when the middleware completes its operation.
 */
export const protect = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Getting Token and check of it's there
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError("You are not logged In. Plz logged In to get access", 401)
      );
    }

    // 2) Verification Token
    const decode = await verifyToken(token, process.env.JWT_SECRET as string);
    //   const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if User still exist
    const currentUser = (await userModel.findById(decode.id)) as IUser;
    if (!currentUser) {
      return next(
        new AppError(
          "The current user belonging to this token does no longer exist.",
          401
        )
      );
    }

    // 4) Check if user changed Password after the token was issued.
    if (currentUser.changedPasswordAfter(decode.iat)) {
      return next(
        new AppError("User recently changed Password! Please login again.", 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTES
    req.user = currentUser;

    next();
  }
);

/**
 * Middleware to restrict access based on user roles.
 *
 * @param {userRole[]} roles - The roles allowed to access the route.
 * @returns {function} Middleware function that checks user roles.
 *
 * @typedef {object} CustomRequest - The custom request object.
 * @property {object} user - The user object on the request.
 * @property {userRole} user.role - The role of the user.
 *
 * @typedef {object} Response - The Express response object.
 *
 * @typedef {function} NextFunction - The Express next function.
 *
 * @throws {AppError} Throws an AppError if user roles are not allowed.
 */
export const restrictTo = (...roles: userRole[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("user is undefined.", 404));
    if (!roles.includes(req.user.role as userRole)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
