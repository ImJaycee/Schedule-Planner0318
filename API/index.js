import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js'; // Import the logger
import authRoute from './routes/auth.js';
import userRoute from './routes/userRoute.js';
import shiftRoute from './routes/scheduleRoute.js';
import announcementRoutes from './routes/announcementRoute.js';
import profileEditRoute from './routes/profileEditRoute.js';
import requestShift from './routes/requestRoute.js';
import userManageRoute from './routes/userManageRoute.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT;
console.log(PORT);
const MONGO_URL = process.env.MONGO_URL;

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    logger.info('Connected to MongoDB'); // Log successful connection
  } catch (e) {
    logger.error(`MongoDB connection error: ${e.message}`); // Log connection error
    throw e;
  }
};

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Log all incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/shift", shiftRoute);
app.use('/api/announcements', announcementRoutes);
app.use('/api/edit', profileEditRoute);
app.use('/api/request-shift', requestShift);
app.use('/api/user-manage', userManageRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  logger.error(`${req.method} ${req.url} - ${errorMessage}`); // Log the error
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(PORT, () => {
  connect();
  logger.info(`Server is running on port ${PORT}`); // Log server start
});