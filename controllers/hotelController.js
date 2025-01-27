const fs = require("fs");

const hotels = JSON.parse(fs.readFileSync(`${__dirname}/../data/hotels.json`));

// Middleware to check if hotel ID is valid
exports.checkID = (req, res, next, val) => {
  console.log(`Hotel id is: ${val}`);

  // Check if the ID is a valid number and exists in the hotels array
  const hotel = hotels.find((hotel) => hotel.id === parseInt(val, 10));

  if (!hotel) {
    return res.status(404).json({
      status: "Failed",
      message: "Invalid ID",
    });
  }
  next();
};

// Get all hotels
exports.getAllHotels = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: hotels.length,
    data: {
      hotels,
    },
  });
};

exports.getHotel = (req, res) => {
  const id = req.params.id * 1; // Access `req.params.id` correctly

  const hotel = hotels.find((hotel) => hotel.id === id);

  if (!hotel) {
    return res.status(404).json({
      status: "fail",
      message: "Hotel not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      hotel,
    },
  });
};

exports.createHotel = () => {
  console.log("Hotel created");
};

exports.updateHotel = () => {
  console.log("Update hotel");
};

exports.deleteHotel = () => {
  console.log("Delete hotel");
};
