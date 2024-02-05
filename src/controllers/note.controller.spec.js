import ApiError from '../utils/apiError';
import ApiResponse from '../utils/apiResponse';
import { Note } from '../models/note.model';
import { User } from '../models/user.model';
import { jest } from '@jest/globals';
import { noteController } from './note.controller';
import { uploadOnCloudinary } from '../utils/cloudinary';

// import jest from 'jest';





jest.mock('../utils/cloudinary');

describe('Note Controller', () => {
  describe('createNote', () => {
    it('should create a new note', async () => {
      const req = {
        body: {
          title: 'Test Note',
          content: 'This is a test note',
        },
        files: [
          { path: '/path/to/image1.jpg' },
          { path: '/path/to/image2.jpg' },
        ],
        cookies: {
          refreshToken: 'testRefreshToken',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const userId = 'testUserId';
      const cloudinaryImages = ['image1Url', 'image2Url'];

      User.findOne = jest.fn().mockResolvedValue({ _id: userId });
      uploadOnCloudinary.mockImplementation((image) => {
        return new Promise((resolve) => {
          resolve(`url_${image}`);
        });
      });
      Note.create = jest.fn().mockResolvedValue({
        _id: 'testNoteId',
        title: 'Test Note',
        content: 'This is a test note',
        author: userId,
        images: cloudinaryImages,
      });

      await noteController.createNote(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        refreshToken: 'testRefreshToken',
      });
      expect(uploadOnCloudinary).toHaveBeenCalledTimes(2);
      expect(Note.create).toHaveBeenCalledWith({
        title: 'Test Note',
        content: 'This is a test note',
        author: userId,
        images: cloudinaryImages,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(
          201,
          {
            _id: 'testNoteId',
            title: 'Test Note',
            content: 'This is a test note',
            author: userId,
            images: cloudinaryImages,
          },
          'Note created successfully'
        )
      );
    });

    it('should return an error if title and content are not provided', async () => {
      const req = {
        body: {},
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const apiError = new ApiError(400, 'Title and content are required');

      await createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(apiError);
    });

    it('should return an error if there is an error saving images', async () => {
      const req = {
        body: {
          title: 'Test Note',
          content: 'This is a test note',
        },
        files: [],
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const apiError = new ApiError(500, 'Error saving images');

      await noteController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(apiError);
    });

    it('should return an error if there is an error uploading images to cloudinary', async () => {
      const req = {
        body: {
          title: 'Test Note',
          content: 'This is a test note',
        },
        files: [
          { path: '/path/to/image1.jpg' },
          { path: '/path/to/image2.jpg' },
        ],
        cookies: {
          refreshToken: 'testRefreshToken',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const userId = 'testUserId';

      User.findOne = jest.fn().mockResolvedValue({ _id: userId });
      uploadOnCloudinary.mockResolvedValue(null);

      const apiError = new ApiError(
        500,
        'Error uploading images to cloudinary'
      );

      await createNote(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        refreshToken: 'testRefreshToken',
      });
      expect(uploadOnCloudinary).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(apiError);
    });

    it('should return an error if note creation fails', async () => {
      const req = {
        body: {
          title: 'Test Note',
          content: 'This is a test note',
        },
        files: [
          { path: '/path/to/image1.jpg' },
          { path: '/path/to/image2.jpg' },
        ],
        cookies: {
          refreshToken: 'testRefreshToken',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const userId = 'testUserId';
      const cloudinaryImages = ['image1Url', 'image2Url'];

      User.findOne = jest.fn().mockResolvedValue({ _id: userId });
      uploadOnCloudinary.mockImplementation((image) => {
        return new Promise((resolve) => {
          resolve(`url_${image}`);
        });
      });
      Note.create = jest.fn().mockResolvedValue(null);

      const apiError = new ApiError(
        500,
        'Oops! Note creation failed. Please try again.'
      );

      await createNote(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        refreshToken: 'testRefreshToken',
      });
      expect(uploadOnCloudinary).toHaveBeenCalledTimes(2);
      expect(Note.create).toHaveBeenCalledWith({
        title: 'Test Note',
        content: 'This is a test note',
        author: userId,
        images: cloudinaryImages,
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(apiError);
    });
  });

  describe('getNotes', () => {
    it('should get all notes for a user', async () => {
      const req = {
        cookies: {
          refreshToken: 'testRefreshToken',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const userId = 'testUserId';
      const notes = [
        { _id: 'note1Id', title: 'Note 1', content: 'This is note 1' },
        { _id: 'note2Id', title: 'Note 2', content: 'This is note 2' },
      ];

      User.findOne = jest.fn().mockResolvedValue({ _id: userId });
      Note.find = jest.fn().mockResolvedValue(notes);

      await getNotes(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        refreshToken: 'testRefreshToken',
      });
      expect(Note.find).toHaveBeenCalledWith({ author: userId });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(200, notes, 'Notes retrieved successfully')
      );
    });

    it('should return an error if no notes are found', async () => {
      const req = {
        cookies: {
          refreshToken: 'testRefreshToken',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const userId = 'testUserId';

      User.findOne = jest.fn().mockResolvedValue({ _id: userId });
      Note.find = jest.fn().mockResolvedValue(null);

      const apiError = new ApiError(404, 'No notes found');

      await getNotes(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        refreshToken: 'testRefreshToken',
      });
      expect(Note.find).toHaveBeenCalledWith({ author: userId });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(apiError);
    });
  });

  describe('updateNote', () => {
    it('should update a note', async () => {
      const req = {
        body: {
          title: 'Updated Note',
          content: 'This is an updated note',
        },
        params: {
          id: 'testNoteId',
        },
        files: [
          { path: '/path/to/image1.jpg' },
          { path: '/path/to/image2.jpg' },
        ],
        cookies: {
          refreshToken: 'testRefreshToken',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const userId = 'testUserId';
      const cloudinaryImages = ['updatedImage1Url', 'updatedImage2Url'];

      User.findOne = jest.fn().mockResolvedValue({ _id: userId });
      uploadOnCloudinary.mockImplementation((image) => {
        return new Promise((resolve) => {
          resolve(`url_${image}`);
        });
      });
      Note.findByIdAndUpdate = jest.fn().mockResolvedValue({
        _id: 'testNoteId',
        title: 'Updated Note',
        content: 'This is an updated note',
        author: userId,
        images: cloudinaryImages,
      });

      await nodeController.updateNote(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        refreshToken: 'testRefreshToken',
      });
      expect(uploadOnCloudinary).toHaveBeenCalledTimes(2);
      expect(Note.findByIdAndUpdate).toHaveBeenCalledWith(
        'testNoteId',
        {
          title: 'Updated Note',
          content: 'This is an updated note',
          user: userId,
          images: cloudinaryImages,
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(
          200,
          {
            _id: 'testNoteId',
            title: 'Updated Note',
            content: 'This is an updated note',
            author: userId,
            images: cloudinaryImages,
          },
          'Note updated successfully'
        )
      );
    });

    it('should return an error if title and content are not provided', async () => {
      const req = {
        body: {},
        params: {
          id: 'testNoteId',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const apiError = new ApiError(400, 'Title and content are required');

      await updateNote(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(apiError);
    });

    it('should return an error if user is unauthorized', async () => {
      const req = {
        body: {
          title: 'Updated Note',
          content: 'This is an updated note',
        },
        params: {
          id: 'testNoteId',
        },
        cookies: {
          refreshToken: 'testRefreshToken',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne = jest.fn().mockResolvedValue(null);

      const apiError = new ApiError(401, 'Unauthorized Access');

      await updateNote(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        refreshToken: 'testRefreshToken',
      });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(apiError);
    });

    it('should return an error if there is an error saving images', async () => {
      const req = {
        body: {
          title: 'Updated Note',
          content: 'This is an updated note',
        },
        params: {
          id: 'testNoteId',
        },
        files: [],
        cookies: {
          refreshToken: 'testRefreshToken',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const userId = 'testUserId';

      User.findOne = jest.fn().mockResolvedValue({ _id: userId });

      const apiError = new ApiError(500, 'Error saving images');

      await updateNote(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        refreshToken: 'testRefreshToken',
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(apiError);
    });

    it('should return an error if there is an error uploading images to cloudinary', async () => {
      const req = {
        body: {
          title: 'Updated Note',
          content: 'This is an updated note',
        },
        params: {
          id: 'testNoteId',
        },
        files: [
          { path: '/path/to/image1.jpg' },
          { path: '/path/to/image2.jpg' },
        ],
        cookies: {
          refreshToken: 'testRefreshToken',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const userId = 'testUserId';

      User.findOne = jest.fn().mockResolvedValue({ _id: userId });
      uploadOnCloudinary.mockResolvedValue(null);

      const apiError = new ApiError(
        500,
        'Error uploading images to Cloudinary'
      );

      await updateNote(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        refreshToken: 'testRefreshToken',
      });
      expect(uploadOnCloudinary).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(apiError);
    });

    it('should return an error if note is not found', async () => {
      const req = {
        body: {
          title: 'Updated Note',
          content: 'This is an updated note',
        },
        params: {
          id: 'testNoteId',
        },
        files: [
          { path: '/path/to/image1.jpg' },
          { path: '/path/to/image2.jpg' },
        ],
        cookies: {
          refreshToken: 'testRefreshToken',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const userId = 'testUserId';
      const cloudinaryImages = ['updatedImage1Url', 'updatedImage2Url'];

      User.findOne = jest.fn().mockResolvedValue({ _id: userId });
      uploadOnCloudinary.mockImplementation((image) => {
        return new Promise((resolve) => {
          resolve(`url_${image}`);
        });
      });
      Note.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const apiError = new ApiError(404, 'Note not found');

      await updateNote(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        refreshToken: 'testRefreshToken',
      });
      expect(uploadOnCloudinary).toHaveBeenCalledTimes(2);
      expect(Note.findByIdAndUpdate).toHaveBeenCalledWith(
        'testNoteId',
        {
          title: 'Updated Note',
          content: 'This is an updated note',
          user: userId,
          images: cloudinaryImages,
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(apiError);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      const req = {
        params: {
          id: 'testNoteId',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const note = {
        _id: 'testNoteId',
        title: 'Test Note',
        content: 'This is a test note',
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      };

      Note.findByIdAndUpdate = jest.fn().mockResolvedValue(note);

      await deleteNote(req, res);

      expect(Note.findByIdAndUpdate).toHaveBeenCalledWith(
        'testNoteId',
        {
          $set: { isDeleted: true, deletedAt: expect.any(String) },
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(200, note, 'Note deleted successfully')
      );
    });

    it('should return an error if note is not found', async () => {
      const req = {
        params: {
          id: 'testNoteId',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Note.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const apiError = new ApiError(404, 'Note not found');

      await deleteNote(req, res);

      expect(Note.findByIdAndUpdate).toHaveBeenCalledWith(
        'testNoteId',
        {
          $set: { isDeleted: true, deletedAt: expect.any(String) },
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(apiError);
    });
  });
});
