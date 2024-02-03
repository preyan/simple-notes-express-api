import { asyncHandler } from '../utils/asyncHandler';
import { jwt } from 'jsonwebtoken';

export const verifyJWTToken = asyncHandler(async (req, res, next) => {
  try {
    // Get the token from the request header or from the cookie
    const token =
      req.cookies?.accessToken || req.header('Authorization')?.split(' ')[1]; // Get the token from the request since header contains the token as `Authorization: Bearer <token>'`

    if (!token) {
      throw new ApiError(401, 'Unauthorized Request : Access token is missing');
    }

    // Verify the token and get the decoded token
    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Check if the user exists
    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken'
    );

    // Throw an error if the user does not exist
    if (!user) {
      throw new ApiError(404, 'Invalid access token OR User not found');
    }

    req.user = user; // Set the user object in the request object

    next(); // Call the next middleware
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid Access token');
  }
});
