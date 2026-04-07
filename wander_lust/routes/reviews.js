// routes/reviews.js
// Review routes nested under listings

const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams gives access to :id from parent router
const wrapAsync = require("../utils/wrapAsync.js");
const reviewsController = require("../controllers/reviews.js");
const {
  isLoggedIn,
  isReviewAuthor,
  validateReview,
} = require("../middleware.js");

// POST a new review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewsController.createReview)
);

// DELETE a review
// NOTE: isReviewAuthor is async so must be wrapped to catch DB/CastErrors
router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(isReviewAuthor),
  wrapAsync(reviewsController.destroyReview)
);

module.exports = router;
