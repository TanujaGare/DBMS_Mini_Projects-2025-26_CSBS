// controllers/reviews.js
// Handles creation and deletion of reviews on listings

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// ── CREATE: Add a review to a listing ─────────────────────────────────────────
module.exports.createReview = async (req, res) => {
  console.log("[CREATE-REVIEW] listingId:", req.params.id, "body:", req.body);
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  req.flash("success", "Review posted successfully!");
  res.redirect(`/listings/${listing._id}`);
};

// ── DELETE: Remove a review from a listing ─────────────────────────────────────
// Uses $pull to remove the review reference from the listing's reviews array
module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  console.log("[DELETE-REVIEW] listingId:", id, "reviewId:", reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
};
