import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import UserValidator from '../validators/user.validator.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

/**
 * Generates access and refresh tokens for a given user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<{accessToken: string, refreshToken: string}>} - The generated access and refresh tokens.
 * @throws {ApiError} - If access token generation fails.
 */
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = User.generateRefreshToken();
    const accessToken = User.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //This is to avoid the pre-save middleware from running during the update operation
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Access token generation failed');
  }
};

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

const loginUser = asyncHandler(async (req, res, next) => {
  //Get the user data from the request body
  const { email, username, password } = req.body;

  //Check if any field is empty
  if (!email || !username) {
    throw new ApiError(400, 'Username or email is required');
  }
  if (!password) {
    throw new ApiError(400, 'Password is required');
  }

  //Find the user in the database
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  //Check if the password is correct
  const isPasswordMatch = await user.isPasswordCorrect(password); // `user` is an instance of the User model, (Ref: Line 86)

  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid password');
  }

  //Generate access and refresh tokens for a given user ID
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  //!IMPORTANT : Judge if query is stressing the server, if yes do it the user object itself, else directly update the database
  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  //Creates a new user, sets refreshToken and accessToken is cookies and return a success message
  res
    .status(200)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .cookie('accessToken', accessToken, cookieOptions)
    .json(new ApiResponse(200, user, 'User logged in successfully'));
});

export { registerUser, loginUser };
