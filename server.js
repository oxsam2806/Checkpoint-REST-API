const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from config/.env.
dotenv.config({ path: path.join(__dirname, "config", ".env") });

// Import the User model.
const User = require("./models/User");

// Create the Express application.
const app = express();

// Allow Express to read JSON data sent in request bodies.
app.use(express.json());

// Serve the built React frontend from the public folder.
app.use(express.static(path.join(__dirname, "public")));

// Allow requests from our local React frontend.
app.use(cors({
  origin: "http://localhost:5173",
}));

// GET: Return all users from the database.
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve users" });
  }
});

// POST: Add a new user to the database.
app.post("/api/users", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    // Return a client error if the submitted data is invalid.
    res.status(400).json({ message: error.message });
  }
});

// PUT: Update a user using their MongoDB ID.
app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // Check whether a user with this ID exists.
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Remove a user using their MongoDB ID.
app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    // Check whether a user was actually deleted.
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Send the React homepage when a visitor opens the website.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connect to MongoDB before starting the server.
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error.message);
    process.exit(1);
  }
}

// Start the application.
startServer();
