import { generateAccessAndRefreshToken } from './user.controller.js';

describe('generateAccessAndRefreshToken', () => {
  it('should generate access and refresh tokens for a given user ID', async () => {
    // Mock the User model and its methods
    const User = {
      findById: jest.fn().mockResolvedValue({
        generateRefreshToken: jest.fn().mockResolvedValue('mockedRefreshToken'),
        generateAccessToken: jest.fn().mockResolvedValue('mockedAccessToken'),
        refreshToken: 'mockedRefreshToken',
        save: jest.fn().mockResolvedValue(),
      }),
    };

    // Mock the ApiError class
    class ApiError {
      constructor(status, message) {
        this.status = status;
        this.message = message;
      }
    }

    // Call the function with a mock user ID
    const result = await generateAccessAndRefreshToken('mockedUserId');

    // Assert the expected result
    expect(result).toEqual({
      accessToken: 'mockedAccessToken',
      refreshToken: 'mockedRefreshToken',
    });

    // Assert that the User model methods were called with the correct arguments
    expect(User.findById).toHaveBeenCalledWith('mockedUserId');
    expect(User.generateRefreshToken).toHaveBeenCalled();
    expect(User.generateAccessToken).toHaveBeenCalled();
    expect(User.save).toHaveBeenCalledWith({ validateBeforeSave: false });
  });

  it('should throw an ApiError if access token generation fails', async () => {
    // Mock the User model and its methods to throw an error
    const User = {
      findById: jest
        .fn()
        .mockRejectedValue(new Error('Access token generation failed')),
    };

    // Mock the ApiError class
    class ApiError {
      constructor(status, message) {
        this.status = status;
        this.message = message;
      }
    }

    // Call the function with a mock user ID and expect it to throw an ApiError
    await expect(generateAccessAndRefreshToken('mockedUserId')).rejects.toThrow(
      ApiError
    );
  });
});
