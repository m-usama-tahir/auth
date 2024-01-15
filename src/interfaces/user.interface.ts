/**
 * Interface representing a user document.
 *
 * @interface IUser
 * @extends Document
 */
export interface IUser extends Document {
  _id?: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  passwordConfirm: string | null;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  active: boolean;

  /**
   * Method to check if the provided password matches the user's stored password.
   *
   * @param {string} candidatePassword - The password to check.
   * @param {string} userPassword - The user's stored password.
   * @returns {Promise<boolean>} - A Promise that resolves to true if the passwords match, false otherwise.
   */
  correctPassword(
    password: string,
    candidatePassword: string
  ): Promise<boolean>;

  /**
   * Checks if the user's password was changed after the provided JWT timestamp.
   *
   * @function changedPasswordAfter
   * @memberof IUser
   * @param {number} JWTTimestamp - The timestamp from the JWT payload.
   * @returns {boolean} Returns true if the user's password was changed after the provided JWT timestamp, otherwise false.
   */
  changedPasswordAfter(JWTTimestamp: number): boolean;

  createPasswordResetToken(): string;
}
