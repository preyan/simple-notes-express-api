import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { CommonValidator } from '../validators/common.validator.js';
import Note from '../models/note.model.js';
import User from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

/**
 * Create a new note.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} The created note.
 * @throws {ApiError} If title and content are not provided, or if there are errors saving images or uploading images to cloudinary.
 */
export const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const fieldsToValidate = [title, content];
  if (CommonValidator.isEmptyOrUnavailable(fieldsToValidate)) {
    return new ApiError(400, 'Title and content are required');
  }
  // Get the user ID from the refresh token saved in the cookie
  const refreshToken = req.cookies.refreshToken;
  const userId = await User.findOne({ refreshToken })._id;

  const imagesLocalPaths = req.files.length
    ? req.files?.map((file) => file.path)
    : null;
  if (!imagesLocalPaths) return new ApiError(500, 'Error saving images');

  //Upload images to cloudinary
  const cloudinaryImages = await imagesLocalPaths?.map(async (image) => {
    await uploadOnCloudinary(image);
  });
  if (!cloudinaryImages)
    return new ApiError(500, 'Error uploading images to cloudinary');

  const note = await Note.create({
    title,
    content,
    author: userId,
    images: cloudinaryImages,
  });

  if (!note)
    return new ApiError(500, 'Oops! Note creation failed. Please try again.');
  return res
    .status(201)
    .json(new ApiResponse(201, note, 'Note created successfully'));
});

/**
 * Get all notes for a user
 * @param {string} authorId - The ID of the author
 * @param {function} asyncHandler - The async handler middleware
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next middleware function
 * @returns {object} - The response object containing the notes
 */
export const getNotes = (authorId = asyncHandler(async (req, res) => {
  const notes = await Note.find(authorId);
  if (!notes) {
    return new ApiError(404, 'No notes found');
  }
  return res.status(200).json(new ApiResponse(notes));
}));

/**
 * Updates a note.
 *
 * Fields to update: `title`, `content`, `images`
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} The updated note or an error response.
 */
const updateNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const noteId = req.params.id;
  const fieldsToValidate = [title, content];

  if (CommonValidator.isEmptyOrUnavailable(fieldsToValidate)) {
    return new ApiError(400, 'Title and content are required');
  }

  // Get the user ID from the refresh token saved in the cookie
  const refreshToken = req.cookies.refreshToken;
  const userId = await User.findOne({ refreshToken })._id;

  if (!userId) {
    return new ApiError(401, 'Unauthorized Access');
  }

  // Save images locally
  const imagesLocalPaths = req.files.length
    ? req.files.map((file) => file.path)
    : null;
  if (!imagesLocalPaths) {
    return new ApiError(500, 'Error saving images');
  }

  // Upload saved images to Cloudinary
  const cloudinaryImages = await Promise.all(
    imagesLocalPaths.map(async (image) => {
      return await uploadOnCloudinary(image);
    })
  );
  if (!cloudinaryImages) {
    return new ApiError(500, 'Error uploading images to Cloudinary');
  }

  const note = await Note.findByIdAndUpdate(
    noteId,
    { title, content, user: userId, images: cloudinaryImages },
    { new: true }
  );

  if (!note) {
    return new ApiError(404, 'Note not found');
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, note, 'Note updated successfully'));
  }
});

/**
 * Deletes a note by setting the 'isDeleted' flag to true and updating the 'deletedAt' field.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with status code and message.
 */
export const deleteNote = asyncHandler(async (req, res) => {
  const noteId = req.params.id;
  const note = await Note.findByIdAndUpdate(
    noteId,
    {
      $set: { isDeleted: true, deletedAt: new Date().toISOString() },
    },
    { new: true }
  );
  if (!note) {
    return new ApiError(404, 'Note not found');
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, note, 'Note deleted successfully'));
  }
});

export const noteController = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
