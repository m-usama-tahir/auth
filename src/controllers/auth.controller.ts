import { Request, Response, NextFunction } from "express";
import userModel from "./../models/user.model";
import { IUser } from "./../interfaces/user.interface";
import catchAsync from "../utils/catchAsync.util";
import { signToken } from "./../utils/token.util";
import AppError from "../utils/appError.util";
import { sendEmail } from "../utils/email.util";
import crypto from "crypto";
/**
 * Handles user signup by creating a new user, generating a JWT token, and sending the token in the response.
 *
 * @function signup
 * @memberof controllers.auth
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - A promise resolving to void.
 * @throws {AppError} - Throws an error if user creation fails or if there's an issue signing the token.
 */
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    /**
     * Create a new user with the provided information.
     *
     * @type {IUser}
     */
    const newUser = await userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    /**
     * Sign a JWT token for the newly created user.
     *
     * @type {string}
     */
    const token = signToken(newUser._id);

    /**
     * Send a success response with the generated token and user data.
     */
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  }
);

/**
 * Handles user login by validating credentials and providing a JWT token upon success.
 *
 * @function login
 * @memberof controllers.auth
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - A promise resolving to void.
 * @throws {AppError} - Throws an error if email or password is missing, user doesn't exist, or the password is incorrect.
 */
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) check if email and password is exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    // 2) check if user exist and password is correct
    const user = (await userModel
      .findOne({ email })
      .select("+password")) as IUser;
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect Email or Password!", 401));
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).header("Bearer", token).json({
      status: "success",
      token,
    });
  }
);

/**
 * Send a password reset token to the user's email.
 *
 * @function
 * @memberof module:controllers/auth
 * @name forgotPassword
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 * @returns {Promise<void>} A Promise that resolves after sending the password reset token.
 */
export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on Posted Email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email address!", 404));
  }

  // 2) Generate the random reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPassword/${resetToken}`;

  const message = `Forgot your Password? Submit a Patch request with your new password and password confirm to: ${resetUrl}.\n If you didn't forget your password, please ignore this email! `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset Token. (Valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

/**
 * Reset the password for a user using a token.
 *
 * @function
 * @memberof module:controllers/auth
 * @name resetPassword
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 * @returns {Promise<void>} A Promise that resolves after the password is reset.
 */
export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is a user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changePasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = signToken(user._id);
  res.status(200).header("Bearer", token).json({
    status: "success",
    token,
  });
});
