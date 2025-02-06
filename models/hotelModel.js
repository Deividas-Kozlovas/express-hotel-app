const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A hotel must have name"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Must have address"],
    },
    rankingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Ranking must be above 1"],
      max: [10, "Highest ranking must be below 10"],
    },
    room_price: {
      type: Number,
      required: [true, "Must have room price"],
    },
    price_discount: {
      type: Number,
    },
    comfort: {
      type: String,
      required: [true, "A hotel must have stars level"],
      enum: {
        values: ["1", "2", "3", "4", "5", "6", "7"],
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A hotel must have summary"],
    },
    image_cover: {
      type: String,
      required: [true, "A hotel must have an image"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for reviews
hotelSchema.virtual("reviews", {
  ref: "Review", // Reference to the Review model
  localField: "_id", // The field in the Hotel model
  foreignField: "hotel", // The field in the Review model
});

const Hotel = mongoose.model("Hotel", hotelSchema); // Correct model name

module.exports = Hotel;
