import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import UserValidator from '../validators/user.validator.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

/**
 * Registers a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object with success message.
 */
const registerUser = asyncHandler(async (req, res, next) => {
  //Get the user data from the request body
  const { fullName, username, email, password } = req.body;

  /**
   * Add validations for User data
   */

  //Check if any field is empty
  const fieldsToValidate = [fullName, username, email, password];
  if (UserValidator.isEmptyOrUnavailable(fieldsToValidate)) {
    console.log('All fields are required');
    throw new ApiError(400, 'All fields are required');
  }
  //Check if the username or email is already taken
  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userExists) {
    throw new ApiError(409, 'Username or email is already taken');
  }

  //Get the local path of the avatar image
  const avatarLocalPath = req.file.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is required');
  }

  //Upload the avatar to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, 'Avatar upload failed');
  }

  //Create a new user in the database
  const user = await User.create({
    fullName,
    username: username?.toLowerCase(),
    email,
    password,
    avatar: avatar.secure_url,
  });

  //Find the user in the database and return the user data without the password and refresh token
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(500, 'User registration failed on our end');
  }

  //Create a new user and return a success message
  res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User registered successfully'));
});

export { registerUser };
