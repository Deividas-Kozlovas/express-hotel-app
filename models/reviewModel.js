const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review cannot be empty"],
  },
  rating: {
    // Fixed the typo "reating" to "rating"
    type: Number,
    min: 1,
    max: 5,
    required: [true, "You need to leave a rating"],
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: "Hotel",
    required: [true, "You must select a hotel"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "You must select a user"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Pre-find hook to populate fields before fetching reviews
reviewSchema.pre(/^find/, function (next) {
  // Populating hotel and user fields with selected fields
  this.populate({
    path: "hotel",
    select: "name",
  }).populate({
    path: "user",
    select: "name",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema); // Using 'reviewSchema' to define the 'Review' model

module.exports = Review;
