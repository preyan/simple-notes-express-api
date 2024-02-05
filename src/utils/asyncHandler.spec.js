import { asyncHandler } from './asyncHandler.js';
import {jest} from '@jest/globals';

describe('asyncHandler', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn();
  });

  it('should call the request handler function', async () => {
    const mockRequestHandler = jest.fn().mockResolvedValue('test');
    const wrappedRequestHandler = asyncHandler(mockRequestHandler);

    await wrappedRequestHandler(mockRequest, mockResponse, mockNext);

    expect(mockRequestHandler).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
  });

  it('should pass any errors to the next middleware', async () => {
    const mockError = new Error('test error');
    const mockRequestHandler = jest.fn().mockRejectedValue(mockError);
    const wrappedRequestHandler = asyncHandler(mockRequestHandler);

    await wrappedRequestHandler(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it('should not call next middleware if no error occurs', async () => {
    const mockRequestHandler = jest.fn().mockResolvedValue('test');
    const wrappedRequestHandler = asyncHandler(mockRequestHandler);

    await wrappedRequestHandler(mockRequest, mockResponse, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });
});