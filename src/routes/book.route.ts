import { Router } from "express";
import * as bookController from "./../controllers/book.controller";
import {
  protect as authProtect,
  restrictTo,
} from "../middlewares/auth.middleware";
import { userRole } from "../enums/user.enum";

/**
 * Express router for book-related routes.
 *
 * @type {Router}
 */
const router = Router();

/**
 * Route for getting all books or creating a new book.
 *
 * @name GET /api/v1/book
 * @name POST /api/v1/book
 * @function
 * @memberof module:routes/bookRoute
 */
router
  .route("/")
  .get(authProtect, bookController.getAllBooks)
  .post(authProtect, restrictTo(userRole.ADMIN), bookController.createBook);

/**
 * Route for getting, updating, or deleting a specific book by ID.
 *
 * @name GET /api/v1/book/:bookId
 * @name PATCH /api/v1/book/:bookId
 * @name DELETE /api/v1/book/:bookId
 * @function
 * @memberof module:routes/bookRoute
 */
router
  .route("/:bookId")
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

/**
 * Exports the router.
 *
 * @exports router
 */
export default router;
