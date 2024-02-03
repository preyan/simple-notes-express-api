/**
 * Wraps an asynchronous request handler function with error handling middleware.
 *
 * @param {Function} requestHandler - The asynchronous request handler function.
 * @returns {Function} - The wrapped request handler function.
 */
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
