// routes/listings.js
// CRUD routes for listings

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingsController = require("../controllers/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// INDEX & CREATE
router
  .route("/")
  .get(wrapAsync(listingsController.index))
  .post(isLoggedIn, validateListing, wrapAsync(listingsController.createListing));

// NEW form — must come before /:id to avoid conflict
router.get("/new", isLoggedIn, listingsController.renderNewForm);

// SHOW, UPDATE & DELETE (single listing)
// NOTE: isOwner is async so it must be wrapped with wrapAsync to catch DB errors
router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(isLoggedIn, wrapAsync(isOwner), validateListing, wrapAsync(listingsController.updateListing))
  .delete(isLoggedIn, wrapAsync(isOwner), wrapAsync(listingsController.destroyListing));

// EDIT form — wrapAsync on isOwner to handle DB errors during authorization
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(isOwner),
  wrapAsync(listingsController.renderEditForm)
);

module.exports = router;
