import mongoose, { Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { IUser } from "./../interfaces/user.interface";
import crypto from "crypto";

/**
 * Mongoose schema for the User model.
 *
 * @type {Schema<IUser>}
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["admin", "guide", "lead-guide", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    validate: {
      validator: function (this: IUser, el: string) {
        return el === this.password;
      },
      message: "Password are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/**
 * Mongoose pre-save middleware to hash the password before saving the user.
 *
 * @function
 * @async
 * @param {Function} next - The next function in the middleware chain.
 * @returns {Promise<void>} - A Promise that resolves when the middleware completes.
 */
userSchema.pre("save", async function (next) {
  // Only run this function if Password are modified.
  if (!this.isModified("password")) return next();

  // Hashed the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete password confirm field
  this.set("passwordConfirm", undefined);
  next();
});

/**
 * Middleware function to be executed before saving a user document.
 * It updates the `passwordChangedAt` field if the password is modified or it's a new user.
 *
 * @function
 * @memberof module:models/user
 * @name preSaveMiddleware
 * @param {Function} next - The function to be called to pass control to the next middleware.
 * @returns {void}
 */
userSchema.pre("save", function (next) {
  // Check if the password is modified or it's a new user
  if (!this.isModified("password") || this.isNew) return next();

  // Update the passwordChangedAt field with the current time minus 1000 milliseconds
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

/**
 * Mongoose method to check if the provided password matches the user's stored password.
 *
 * @function
 * @async
 * @param {string} candidatePassword - The password to check.
 * @param {string} userPassword - The user's stored password.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the passwords match, false otherwise.
 */
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Checks if the user's password was changed after a given JWT timestamp.
 *
 * @method changedPasswordAfter
 * @memberof UserSchema.methods
 * @param {number} JWTTimestamp - The timestamp of the JWT issuance.
 * @returns {boolean} Returns true if the password was changed after the given JWT timestamp, otherwise false.
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    // Convert passwordChangedAt timestamp to seconds
    const changedTimeStamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );

    return JWTTimestamp < changedTimeStamp;
  }

  // FALSE means not changed.
  return false;
};

/**
 * Generate a random password reset token, hash it, and set the expiration time.
 *
 * @function
 * @memberof module:models/user
 * @name createPasswordResetToken
 * @returns {string} The generated reset token.
 */
userSchema.methods.createPasswordResetToken = function () {
  // Generate a random password reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the reset token and update the passwordResetToken field
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expiration time for the password reset token (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Return the unhashed reset token (to be sent to the user)
  return resetToken;
};

/**
 * Mongoose model for the User collection.
 *
 * @type {Model<IUser>}
 */
const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
