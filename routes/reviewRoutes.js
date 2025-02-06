const express = require("express");
const router = express.Router({ mergeParams: true });

const reviewContreoller = require("../controllers/reviewController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(reviewContreoller.getAllReviews)
  .post(reviewContreoller.createReview);

module.exports = router;
