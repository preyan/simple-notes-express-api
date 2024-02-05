import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { CommonValidator } from '../validators/common.validator.js';
import { Note } from '../models/note.model.js';
import { User } from '../models/user.model.js';
import { jest } from '@jest/globals';
import { noteController } from './note.controller.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

jest.mock('../utils/apiError.js');
jest.mock('../utils/apiResponse.js');
jest.mock('../validators/common.validator.js');
jest.mock('../models/note.model.js');
jest.mock('../models/user.model.js');
jest.mock('../utils/cloudinary.js');

//TODO - Fix all tests
xdescribe('Note Controller', () => {
  describe('createNote', () => {
    it('should create a new note', async () => {
      const req = {
        body: {
          title: 'Test Note',
          content: 'This is a test note',
        },
        cookies: {
          refreshToken: 'testRefreshToken',
        },
        files: [{ path: 'image1.jpg' }, { path: 'image2.jpg' }],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      CommonValidator.isEmptyOrUnavailable.mockReturnValue(false);
      User.findOne.mockReturnValue({ _id: 'testUserId' });
      uploadOnCloudinary.mockResolvedValue('cloudinaryImageUrl');

      await noteController.noteController.createNote(req, res, next);

      expect(Note.create).toHaveBeenCalledWith({
        title: 'Test Note',
        content: 'This is a test note',
        author: 'testUserId',
        images: ['cloudinaryImageUrl', 'cloudinaryImageUrl'],
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(201, expect.any(Object), 'Note created successfully')
      );
    });

    it('should handle missing title and content', async () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      CommonValidator.isEmptyOrUnavailable.mockReturnValue(true);

      await noteController.createNote(req, res, next);

      expect(ApiError).toHaveBeenCalledWith(
        400,
        'Title and content are required'
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiError());
    });

    it('should handle error saving images', async () => {
      const req = {
        body: {
          title: 'Test Note',
          content: 'This is a test note',
        },
        cookies: {
          refreshToken: 'testRefreshToken',
        },
        files: [],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      CommonValidator.isEmptyOrUnavailable.mockReturnValue(false);
      User.findOne.mockReturnValue({ _id: 'testUserId' });

      await noteController.createNote(req, res, next);

      expect(ApiError).toHaveBeenCalledWith(500, 'Error saving images');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(new ApiError());
    });

    it('should handle error uploading images to cloudinary', async () => {
      const req = {
        body: {
          title: 'Test Note',
          content: 'This is a test note',
        },
        cookies: {
          refreshToken: 'testRefreshToken',
        },
        files: [{ path: 'image1.jpg' }, { path: 'image2.jpg' }],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      CommonValidator.isEmptyOrUnavailable.mockReturnValue(false);
      User.findOne.mockReturnValue({ _id: 'testUserId' });
      uploadOnCloudinary.mockRejectedValue(new Error('Upload error'));

      await noteController.createNote(req, res, next);

      expect(ApiError).toHaveBeenCalledWith(
        500,
        'Error uploading images to cloudinary'
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(new ApiError());
    });

    it('should handle note creation failure', async () => {
      const req = {
        body: {
          title: 'Test Note',
          content: 'This is a test note',
        },
        cookies: {
          refreshToken: 'testRefreshToken',
        },
        files: [{ path: 'image1.jpg' }, { path: 'image2.jpg' }],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      CommonValidator.isEmptyOrUnavailable.mockReturnValue(false);
      User.findOne.mockReturnValue({ _id: 'testUserId' });
      uploadOnCloudinary.mockResolvedValue('cloudinaryImageUrl');
      Note.create.mockReturnValue(null);

      await noteController.createNote(req, res, next);

      expect(ApiError).toHaveBeenCalledWith(
        500,
        'Oops! Note creation failed. Please try again.'
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(new ApiError());
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

      User.findOne.mockReturnValue({ _id: 'testUserId' });
      Note.find.mockReturnValue(['note1', 'note2']);

      await noteController.getNotes(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        refreshToken: 'testRefreshToken',
      });
      expect(Note.find).toHaveBeenCalledWith({ author: 'testUserId' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(200, ['note1', 'note2'], 'Notes retrieved successfully')
      );
    });

    it('should handle no notes found', async () => {
      const req = {
        cookies: {
          refreshToken: 'testRefreshToken',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockReturnValue({ _id: 'testUserId' });
      Note.find.mockReturnValue(null);

      await noteController.getNotes(req, res);

      expect(ApiError).toHaveBeenCalledWith(404, 'No notes found');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiError());
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
        cookies: {
          refreshToken: 'testRefreshToken',
        },
        files: [{ path: 'image1.jpg' }, { path: 'image2.jpg' }],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      CommonValidator.isEmptyOrUnavailable.mockReturnValue(false);
      User.findOne.mockReturnValue({ _id: 'testUserId' });
      uploadOnCloudinary.mockResolvedValue('cloudinaryImageUrl');
      Note.findByIdAndUpdate.mockReturnValue({
        _id: 'testNoteId',
        title: 'Updated Note',
        content: 'This is an updated note',
      });

      await noteController.updateNote(req, res);

      expect(Note.findByIdAndUpdate).toHaveBeenCalledWith(
        'testNoteId',
        {
          title: 'Updated Note',
          content: 'This is an updated note',
          user: 'testUserId',
          images: ['cloudinaryImageUrl', 'cloudinaryImageUrl'],
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(200, expect.any(Object), 'Note updated successfully')
      );
    });

    it('should handle missing title and content', async () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      CommonValidator.isEmptyOrUnavailable.mockReturnValue(true);

      await noteController.updateNote(req, res);

      expect(ApiError).toHaveBeenCalledWith(
        400,
        'Title and content are required'
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(new ApiError());
    });

    it('should handle unauthorized access', async () => {
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
        files: [{ path: 'image1.jpg' }, { path: 'image2.jpg' }],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      CommonValidator.isEmptyOrUnavailable.mockReturnValue(false);
      User.findOne.mockReturnValue(null);

      await noteController.updateNote(req, res);

      expect(ApiError).toHaveBeenCalledWith(401, 'Unauthorized Access');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(new ApiError());
    });

    it('should handle error saving images', async () => {
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
        files: [],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      CommonValidator.isEmptyOrUnavailable.mockReturnValue(false);
      User.findOne.mockReturnValue({ _id: 'testUserId' });

      await noteController.updateNote(req, res);

      expect(ApiError).toHaveBeenCalledWith(500, 'Error saving images');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(new ApiError());
    });

    it('should handle error uploading images to cloudinary', async () => {
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
        files: [{ path: 'image1.jpg' }, { path: 'image2.jpg' }],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      CommonValidator.isEmptyOrUnavailable.mockReturnValue(false);
      User.findOne.mockReturnValue({ _id: 'testUserId' });
      uploadOnCloudinary.mockRejectedValue(new Error('Upload error'));

      await noteController.updateNote(req, res);

      expect(ApiError).toHaveBeenCalledWith(
        500,
        'Error uploading images to Cloudinary'
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(new ApiError());
    });

    it('should handle note not found', async () => {
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
        files: [{ path: 'image1.jpg' }, { path: 'image2.jpg' }],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      CommonValidator.isEmptyOrUnavailable.mockReturnValue(false);
      User.findOne.mockReturnValue({ _id: 'testUserId' });
      uploadOnCloudinary.mockResolvedValue('cloudinaryImageUrl');
      Note.findByIdAndUpdate.mockReturnValue(null);

      await noteController.updateNote(req, res);

      expect(ApiError).toHaveBeenCalledWith(404, 'Note not found');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiError());
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

      Note.findByIdAndUpdate.mockReturnValue({
        _id: 'testNoteId',
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      });

      await noteController.deleteNote(req, res);

      expect(Note.findByIdAndUpdate).toHaveBeenCalledWith(
        'testNoteId',
        {
          $set: { isDeleted: true, deletedAt: expect.any(String) },
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        new ApiResponse(200, expect.any(Object), 'Note deleted successfully')
      );
    });

    it('should handle note not found', async () => {
      const req = {
        params: {
          id: 'testNoteId',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Note.findByIdAndUpdate.mockReturnValue(null);

      await noteController.deleteNote(req, res);

      expect(ApiError).toHaveBeenCalledWith(404, 'Note not found');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(new ApiError());
    });
  });
});
