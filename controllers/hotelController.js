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

exports.createHotel = (req, res) => {
  console.log("Request body:", req.body); // Log the incoming payload

  const newId = hotels[hotels.length - 1].id + 1;
  const newHotel = Object.assign({ id: newId }, req.body);

  hotels.push(newHotel);

  fs.writeFile(
    `${__dirname}/../data/hotels.json`,
    JSON.stringify(hotels),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "Failed",
          message: "Failed to save data",
        });
      }

      res.status(201).json({
        status: "success",
        data: {
          hotels: newHotel,
        },
      });
    }
  );
};

exports.updateHotel = (req, res) => {
  res.status(200).json({
    status: "Success",
    hotel: "<Updated hotel>",
  });
};

exports.deleteHotel = (req, res) => {
  res.status(204).json({
    status: "Success",
    message: null,
  });
};
