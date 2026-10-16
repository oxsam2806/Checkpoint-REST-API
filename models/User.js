
const mongoose = require("mongoose");

// Define the structure and validation rules for a user.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

// Create and export the User model.
module.exports = mongoose.model("User", userSchema);
