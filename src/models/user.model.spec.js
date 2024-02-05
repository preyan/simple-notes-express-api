import { User } from './user.model';
import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

describe('User Model', () => {
  let user;

  beforeEach(() => {
    user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      fullName: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      notes: [],
      password: 'password123',
      refreshToken: 'refreshToken123',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  //TODO - Add test for the pre-save hook

  describe('isPasswordCorrect method', () => {
    it('should return true if the provided password matches the user password', async () => {
      const mockCompare = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      const result = await user.isPasswordCorrect('password123');
      expect(mockCompare).toHaveBeenCalledWith('password123', 'password123');
      expect(result).toBe(true);
    });

    it('should return false if the provided password does not match the user password', async () => {
      const mockCompare = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(false);
      const result = await user.isPasswordCorrect('wrongpassword');
      expect(mockCompare).toHaveBeenCalledWith('wrongpassword', 'password123');
      expect(result).toBe(false);
    });
  });

  describe('generateAccessToken method', () => {
    it('should generate a JWT access token for the user', async () => {
      const mockSign = jest.spyOn(jwt, 'sign').mockReturnValue('accessToken');
      const result = await user.generateAccessToken();
      expect(mockSign).toHaveBeenCalledWith(
        {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );
      expect(result).toBe('accessToken');
    });
  });

  describe('generateRefreshToken method', () => {
    it('should generate a JWT refresh token for the user', async () => {
      const mockSign = jest.spyOn(jwt, 'sign').mockReturnValue('refreshToken');
      const result = await user.generateRefreshToken();
      expect(mockSign).toHaveBeenCalledWith(
        {
          _id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
      );
      expect(result).toBe('refreshToken');
    });
  });
});
