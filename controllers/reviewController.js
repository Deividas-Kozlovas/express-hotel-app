const { response } = require("express");
const Review = require("../models/reviewModel");

exports.getAllReviews = async (req, res) => {
  try {
    let filter = {};
    if (req.params.hotelId) {
      filter = { hotel: req.params.hotelId };
    }
    const review = await Review.find(filter);
    res.status(200).json({
      response: "Success",
      result: review.length,
      data: { review },
    });
  } catch (err) {
    res.status(400).josn({
      status: "Failed",
      message: err.message,
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    if (!req.body.hotel) req.body.hotel = req.params.hotelId;
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);
    res.status(200).json({
      status: "Success",
      message: "New review where added",
      data: { newReview },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};
