// controllers/listings.js
// Full CRUD controller for listings

const Listing = require("../models/listing.js");

// ── INDEX: Show all listings ───────────────────────────────────────────────────
module.exports.index = async (req, res) => {
  const { search } = req.query;
  let query = {};

  // Search feature: filter by title, location, or country
  if (search) {
    const regex = new RegExp(search, "i");
    query = {
      $or: [{ title: regex }, { location: regex }, { country: regex }],
    };
  }

  const allListings = await Listing.find(query).populate("owner");
  res.render("listings/index.ejs", { allListings, search });
};

// ── NEW: Render create form ────────────────────────────────────────────────────
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// ── CREATE: Save new listing ────────────────────────────────────────────────────
module.exports.createListing = async (req, res) => {
  console.log("[CREATE-LISTING] req.body:", req.body);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing created successfully!");
  res.redirect("/listings");
};

// ── SHOW: Show single listing with reviews ─────────────────────────────────────
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Calculate average rating
  let avgRating = 0;
  if (listing.reviews.length > 0) {
    const total = listing.reviews.reduce((sum, r) => sum + r.rating, 0);
    avgRating = (total / listing.reviews.length).toFixed(1);
  }

  res.render("listings/show.ejs", { listing, avgRating });
};

// ── EDIT: Render edit form ─────────────────────────────────────────────────────
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

// ── UPDATE: Save edited listing ────────────────────────────────────────────────
module.exports.updateListing = async (req, res) => {
  console.log("[UPDATE-LISTING] id:", req.params.id, "body:", req.body);
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// ── DELETE: Remove listing (reviews cascade-deleted via model middleware) ──────
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
