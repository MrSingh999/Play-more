class ApiError extends Error {
  constructor(
    statusCode,
    message = 'Something went wrong',
    error = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.error = error;
    this.stack = stack;
    this.success = false;
    if (stack) {
      this.stack = stack;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ApiError;
