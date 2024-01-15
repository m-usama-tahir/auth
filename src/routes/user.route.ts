import { Router } from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

/**
 * Express router for authentication-related routes.
 *
 * @type {Router}
 */
const router = Router();

/**
 * Route for user signup.
 *
 * @name POST /api/v1/auth/signup
 * @function
 * @memberof module:routes/authRoute
 */
router.post("/signup", signup);

/**
 * Route for user login.
 *
 * @name POST /api/v1/auth/login
 * @function
 * @memberof module:routes/authRoute
 */
router.post("/login", login);

/**
 * Route for forgot password
 *
 * @name POST /api/v1/auth/forgotPassword
 * @function
 * @memberof module:routes/authRoute
 */
router.post("/forgotPassword", forgotPassword);

/**
 * Route for reset password
 *
 * @name PATCH /api/v1/auth/resetPassword/:token
 * @function
 * @memberof module:routes/authRoute
 */
router.patch("/resetPassword/:token", resetPassword);

/**
 * Exports the router.
 *
 * @exports router
 */
export default router;
