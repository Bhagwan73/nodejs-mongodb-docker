class AppError {
  constructor(statusCode, message, errorCode = "", error = true, data = null) {
    this.message = message;
    this.error = error;
    this.data = data;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
