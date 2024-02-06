/* eslint-disable no-undef */

/**
 * The name of the database used in the application.
 * @type {string}
 */
export const DB_NAME = 'simplenotes';

/**
 * The options for cookies.
 * @typedef {Object} CookieOptions
 * @property {boolean} httpOnly - Specifies if the cookie is accessible only through HTTP requests.
 * @property {boolean} secure - Specifies if the cookie should only be sent over secure connections (HTTPS).
 */
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};
