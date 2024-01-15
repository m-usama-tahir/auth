import jwt from "jsonwebtoken";
import { DecodedToken } from "./../interfaces/auth.interface";

/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 *
 * @function signToken
 * @memberof utils
 * @param {any} id - User ID to be included in the JWT payload.
 * @returns {string | undefined} - JWT string if generated successfully, otherwise undefined.
 */
export const signToken = (id: any): string | undefined => {
  /**
   * Secret key used for signing the JWT.
   *
   * @type {string | undefined}
   */
  const JWT_SECRET = process.env.JWT_SECRET;

  if (JWT_SECRET !== undefined) {
    /**
     * Generate and return the JWT with the provided user ID.
     *
     * @type {string}
     */
    return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  } else {
    /**
     * Log a message if the JWT secret is undefined.
     */
    console.log("token not generated!");
    return undefined;
  }
};

/**
 * Verifies a JWT token using the provided secret.
 *
 * @function verifyToken
 * @param {string} token - The JWT token to be verified.
 * @param {string} secret - The secret key used for verification.
 * @returns {Promise<DecodedToken>} A Promise that resolves to the decoded token payload if verification is successful.
 * @throws {Error} Throws an error if verification fails.
 */
export const verifyToken = (
  token: string,
  secret: string
): Promise<DecodedToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as DecodedToken);
      }
    });
  });
};
