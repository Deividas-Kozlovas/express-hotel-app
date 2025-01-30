const mongoose = require("mongoose");

const hotelShema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "A hotel must have name"],
    unique: true,
  },
  address: {
    type: String,
    require: [true, "Must have address"],
  },
  rankingAvarage: {
    type: Number,
    default: 4.5,
    min: [1, "Ranking must be above 1"],
    max: [10, "Highest ranking must be below 10"],
  },
  room_price: {
    type: Number,
    require: [true, "Must have room price"],
  },
  price_discount: {
    trype: Number,
  },
  comfort: {
    type: String,
    require: [true, "A hotel must have starts level"],
    enum: {
      values: ["1", "2", "3", "4", "5", "6", "7"],
    },
  },
  summary: {
    type: String,
    trim: true,
    require: [true, "A hotel must have summary"],
  },
  image_cover: {
    type: String,
    require: [true, "A hotel must have an image"],
  },
  createdAt: {
    type: Date,
    default: Date.now(), // This should be Date.now(), not DataTransfer.now()
    select: false,
  },
});

const Hotel = mongoose.model("Hotek", hotelShema);

module.exports = Hotel;
