// utils/ExpressError.js
// Custom error class to send meaningful HTTP errors

class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ExpressError;
