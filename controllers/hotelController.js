const fs = require("fs");
const mongoose = require("mongoose");

const Hotel = require("./../models/hotelModel");
const { response } = require("../app");

const hotels = JSON.parse(fs.readFileSync(`${__dirname}/../data/hotels.json`));

// Middleware to check if hotel ID is valid
exports.checkID = async (req, res, next, val) => {
  console.log(`Hotel id is: ${val}`);

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(val)) {
    return res.status(400).json({
      status: "Failed",
      message: "Invalid ID format",
    });
  }

  // Check if the hotel exists in the database
  const hotel = await Hotel.findById(val);
  if (!hotel) {
    return res.status(404).json({
      status: "Failed",
      message: "Hotel not found",
    });
  }

  // Attach the hotel to the request object for use in subsequent middleware or route handlers
  req.hotel = hotel;
  next();
};

exports.checkBody = (req, res, next) => {
  const { name, address, ranking, room_price } = req.body;

  if (!name || !address || !ranking || !room_price) {
    return res.status(400).json({
      status: "Failed",
      message: "Please fill all required fields",
    });
  }

  next();
};

// Get all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json({
      results: hotels.length,
      data: {
        hotels,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json({
      status: "Success",
      data: {
        hotel,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.createHotel = async (req, res) => {
  try {
    const newHotel = await Hotel.create(req.body);
    res.status(201).json({
      status: "success",
      data: newHotel,
    });
  } catch (err) {
    res.status(400).json({
      response: "failed",
      message: err,
    });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        hotel,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.deleteHotel = async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      response: "Success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      response: "Failed",
      message: err,
    });
  }
};
