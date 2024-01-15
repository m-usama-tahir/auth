import { IUser } from "./user.interface";
import { Request } from "express";

/**
 * Custom Express Request interface extending the base Request interface.
 * It includes an optional 'user' property, typically used for storing user information
 * after authentication middleware.
 *
 * @interface CustomRequest
 * @extends {Request}
 * @property {IUser | undefined} [user] - An optional user object representing authenticated user information.
 */
export interface CustomRequest extends Request {
  user?: IUser;
}
