import { Request, Response, NextFunction } from "express";
import bookModel from "../models/book.model";
import catchAsync from "../utils/catchAsync.util";
import AppError from "../utils/appError.util";

export const getAllBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const book = await bookModel.find();
    res.status(200).json({
      status: "success",
      result: book.length,
      data: {
        book,
      },
    });
  }
);

export const getBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    const book = await bookModel.findById(bookId);

    /**
     * @description If book not found according to given ID.
     */
    if (!book) {
      return next(
        new AppError(`No book found with that ${req.params.bookId} ID`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        book,
      },
    });
  }
);

export const createBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newBook = await bookModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        book: newBook,
      },
    });
  }
);

export const updateBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const book = await bookModel.findByIdAndUpdate(
      req.params.bookId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        book,
      },
    });
  }
);

export const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const book = await bookModel.findByIdAndDelete(bookId);
  if (!book) {
    new AppError(`No book found with that ${bookId} ID`, 404);
  }
  res.status(200).json({
    status: "success",
    data: {
      msg: `deleteBook of this ${bookId} ID`,
      book,
    },
  });
});
