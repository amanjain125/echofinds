// src/config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Ensure dotenv is loaded here too

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,      // Recommended for new connections
      useUnifiedTopology: true,   // Recommended for new connections
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure if database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;