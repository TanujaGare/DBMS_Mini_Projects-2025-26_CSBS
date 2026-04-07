// utils/wrapAsync.js
// Wraps async route handlers to forward errors to Express error handler

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
