// schema.js
// Joi validation schemas for listings and reviews

const Joi = require("joi");

// Listing Validation Schema
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title cannot be empty.",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description cannot be empty.",
    }),
    image: Joi.string().allow("", null),
    location: Joi.string().required().messages({
      "string.empty": "Location cannot be empty.",
    }),
    country: Joi.string().required().messages({
      "string.empty": "Country cannot be empty.",
    }),
    price: Joi.number().required().min(0).messages({
      "number.base": "Price must be a number.",
      "number.min": "Price cannot be negative.",
    }),
  }).required(),
});

// Review Validation Schema
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5).messages({
      "number.min": "Rating must be at least 1.",
      "number.max": "Rating cannot exceed 5.",
    }),
    comment: Joi.string().required().messages({
      "string.empty": "Comment cannot be empty.",
    }),
  }).required(),
});
