import { asyncHandler } from '../middlewares/async';

/**
 * Registers a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object with success message.
 */
const registerUser = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: 'User Registration Successful' });
});

export { registerUser };
