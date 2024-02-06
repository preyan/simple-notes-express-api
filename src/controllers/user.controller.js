import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { CommonValidator } from '../validators/common.validator.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cookieOptions } from '../constants.js';
import jwt from 'jsonwebtoken';
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

    //Below `user` is an instance of the User model, (Ref: Line 17)
    const refreshToken = await user.generateRefreshToken(); // await is used to wait for the promise to resolve since `generateRefreshToken` is an async function
    const accessToken = await user.generateAccessToken(); // await is used to wait for the promise to resolve since `generateAccessToken` is an async function

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //This is to avoid the pre-save middleware from running during the update operation

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Access or Refresh token generation failed');
  }
};

/**
 * Health check endpoint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with a success message.
 * @throws {ApiError} - If the server is not running.
 */
const healthCheck = asyncHandler(async (req, res) => {
  return await res
    .status(200)
    .json(new ApiResponse(200, null, 'Server is running'));
});

/**
 * Registers a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object with success message.
 */
const registerUser = asyncHandler(async (req, res) => {
  //Get the user data from the request body
  const { fullName, username, email, password } = req.body;

  /**
   * Add validations for User data
   */

  //Check if any field is empty
  const fieldsToValidate = [fullName, username, email, password];
  if (CommonValidator.isEmptyOrUnavailable(fieldsToValidate)) {
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
    throw new ApiError(500, 'Oops! User registration failed on our end');
  }

  //Create a new user and return a success message
  res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User registered successfully'));
});

/**
 * Logs in a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the user is logged in successfully.
 * @throws {ApiError} - If the username or email is missing, password is missing, user is not found, or password is invalid.
 */
const loginUser = asyncHandler(async (req, res) => {
  //Get the user data from the request body
  const { email, username, password } = req.body;

  //Check if any field is empty
  if (!(email || username)) {
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
  const isPasswordMatch = await user.isPasswordCorrect(password); // Here `user` is an instance of the User model, (Ref: Line 86)

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

  if (!loggedInUser || !(accessToken || refreshToken)) {
    throw new ApiError(500, 'Oops! User login failed on our end');
  }

  //Logs in the user, clears cookies and then sets refreshToken and accessToken is cookies and return a success message
  res
    .status(200)
    .cookie('refreshToken', refreshToken.toString(), cookieOptions)
    .cookie('accessToken', accessToken.toString(), cookieOptions)
    .json(new ApiResponse(200, loggedInUser, 'User logged in successfully'));
});

/**
 * Logout user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is logged out.
 */
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie('refreshToken', cookieOptions)
    .clearCookie('accessToken', cookieOptions)
    .json(new ApiResponse(200, null, 'User logged out successfully'));
});

/**
 * Refreshes the access token using the provided refresh token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the access token is refreshed.
 * @throws {ApiError} - If the incoming refresh token is missing or invalid.
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken; //Get the refresh token from the cookies or the request body

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized Access Denied');
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  const user = await User.findById({ _id: decodedToken?._id });

  if (!user) {
    throw new ApiError(401, 'Invalid Refresh Token');
  }

  //Check if the incoming refresh token is the same as the one in the database
  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, 'Refresh Token Expired');
  }

  const { newAccessToken, newRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  if (!(newAccessToken || newRefreshToken)) {
    throw new ApiError(500, 'Access or Refresh token generation failed');
  }

  try {
    res
      .status(200)
      .cookie('accessToken', newAccessToken, cookieOptions)
      .cookie('refreshToken', newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken, refreshToken: newRefreshToken },
          'Access token refreshed successfully'
        )
      );
  } catch (error) {
    throw new ApiError(500, 'Access token refresh failed');
  }
});

/**
 * Change the password for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the password is changed successfully.
 * @throws {ApiError} - If the old password and new password are the same, or if they are not provided, or if the old password is incorrect.
 */
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    throw new ApiError(400, 'Old password and new password cannot be the same');
  }
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, 'Both old and new password are required');
  }

  const user = await User.findById(req.user._id);
  const isPasswordMatch = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordMatch) {
    throw new ApiError(401, 'Incorrect old password');
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Password changed successfully'));
});

/**
 * Get the current user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with the current user information.
 * @throws {ApiError} If the user is not found.
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    '-password -refreshToken'
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User found successfully'));
});

/**
 * Update user details.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the user information is updated.
 * @throws {ApiError} - If at least one field (fullName or email) is not provided.
 */
const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!(fullName || email)) {
    throw new ApiError(400, 'At least one field is required');
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select('-password -refreshToken');
  if (!user) {
    throw new ApiError(500, 'User update failed');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User updated successfully'));
});

/**
 * Updates the user's avatar.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The updated user object.
 * @throws {ApiError} If the avatar is not provided or fails to upload to Cloudinary.
 * @throws {ApiError} If the user avatar update in the database fails.
 * @throws {ApiError} If the old avatar deletion from Cloudinary fails.
 */
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is required');
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, 'Avatar upload to Cloudinary failed');
  }

  /**
   * Get the public ID of the old avatar by splitting the URL and getting the last part of the URL.
   * `Example: https://res.cloudinary.com/dk5b3fj6p/image/upload/v1634171234/avatars/oldAvatarPublicId.jpg`
   */
  const oldAvatarPublicId = req.user?.avatar?.split('/').pop()?.split('.')[0];

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.secure_url,
      },
    },
    { new: true }
  ).select('-password -refreshToken');
  if (!user) {
    throw new ApiError(500, 'User avatar update in database failed');
  }
  if (oldAvatarPublicId) {
    await deleteFromCloudinary(oldAvatarPublicId);
  }
  if (!oldAvatarPublicId) {
    throw new ApiError(500, 'Old avatar deletion from Cloudinary failed');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User avatar updated successfully'));
});

export const userController = {
  healthCheck,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
};
