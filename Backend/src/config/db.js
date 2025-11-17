const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/development";
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(
      `MongoDB connection error (attempt ${retryCount + 1}/${MAX_RETRIES}):`,
      error.message || error
    );

    if (retryCount < MAX_RETRIES - 1) {
      console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return connectDB(retryCount + 1);
    } else {
      console.error(
        "Max retry attempts reached. Unable to connect to MongoDB."
      );
      process.exit(1);
    }
  }
};

module.exports = connectDB;
