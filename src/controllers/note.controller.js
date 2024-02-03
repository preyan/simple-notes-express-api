import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import Note from '../models/note.model.js';

/**
 * Get all notes for a user
 * @route GET /api/v1/notes
 * @access Private
 * @param {string} authorId - The ID of the author
 * @param {function} asyncHandler - The async handler middleware
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next middleware function
 * @returns {object} - The response object containing the notes
 */
export const getNotes = (authorId = asyncHandler(async (req, res, next) => {
  const notes = await Note.findById(authorId);
  if (!notes) {
    return next(new ApiError(404, 'No notes found'));
  }
  return res.status(200).json(new ApiResponse(notes));
}));

export const noteController = {
  getNotes,
};
