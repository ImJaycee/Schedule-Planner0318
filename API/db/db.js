import mongoose from "mongoose";
import logger from "../utils/logger.js"; // Import the logger

const MONGO_URL = process.env.MONGO_URL;

export const connect = async () => {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(MONGO_URL);
    logger.info("Connected to MongoDB"); // Log successful connection
  } catch (error) {
    // Log the error and re-throw it
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit the process if the connection fails
  }
};

