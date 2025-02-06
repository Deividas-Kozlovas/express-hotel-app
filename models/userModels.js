const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs"); // Fixed typo here
const { validate } = require("./hotelModel");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please insert name"],
  },
  email: {
    type: String,
    required: [true, "Please insert your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "is not email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please insert your password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    minlength: 8,
    validate: {
      validator: function (el) {
        return el === this.password; // Check if the password matches
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Pre-save hook to hash password before saving the user
userSchema.pre("save", async function (next) {
  // If the password is not modified, skip the hashing
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the password with a salt of 12 rounds
  this.password = await bcrypt.hash(this.password, 12);
  // Remove the password confirmation field after hashing
  this.passwordConfirm = undefined;
  next();
});

// Method to compare candidate password with the stored hashed password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if the password was changed after a JWT was issued
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000); // Fixed this to 1000

    return JWTTimestamp < changeTimestamp;
  }

  return false; // If there's no password change date, return false (password hasn't changed)
};

const User = mongoose.model("User", userSchema);

module.exports = User;
