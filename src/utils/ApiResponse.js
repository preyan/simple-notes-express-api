/**
 * Represents an API response.
 */
class ApiResponse {
  /**
   * Creates a new ApiResponse instance.
   * @param {number} statusCode - The status code of the response.
   * @param {any} data - The data returned by the API.
   * @param {string} [message='Success'] - The message associated with the response.
   */
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode <= 299;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
