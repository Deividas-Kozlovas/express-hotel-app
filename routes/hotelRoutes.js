const express = require("express");
const hotelController = require("./../controllers/hotelController");
const authController = require("./../controllers/authController");
const reviewRouter = require("../routes/reviewRoutes");

const router = express.Router();

router.param("id", hotelController.checkID);

router
  .route("/")
  .get(hotelController.getAllHotels)
  .post(hotelController.checkBody, hotelController.createHotel);

router
  .route("/:id")
  .get(hotelController.getHotel)
  .patch(hotelController.updateHotel)
  .delete(hotelController.deleteHotel);

router.use("/:hotelId/reviews", reviewRouter);

module.exports = router;
