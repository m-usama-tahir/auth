/**
 * Interface representing the decoded token payload.
 *
 * @interface DecodedToken
 * @property {string} id - User ID extracted from the token.
 * @property {number} iat - Token issuance timestamp.
 */
export interface DecodedToken {
  id: string;
  iat: number;
  // Add other properties based on your token payload
}
