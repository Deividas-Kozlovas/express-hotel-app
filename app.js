const express = require("express");
const morgan = require("morgan");

const app = express();

// Use Morgan middleware to log requests in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const hotelRouter = require("./routes/hotelRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");

app.use(express.json());

// Routes
app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

module.exports = app;
