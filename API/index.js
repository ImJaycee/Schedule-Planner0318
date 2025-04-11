import express from 'express';
import dotenv from 'dotenv';
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

import { limiter } from './utils/rateLimiter.js';
import errorHandler from './utils/errorHandler.js'; // Import the error handler
import { connect } from './db/db.js';
import compression from 'compression';
import { logTokenRequest } from './utils/verifyToken.js'; // Import the logTokenRequest middleware

const app = express();
dotenv.config();

const PORT = process.env.PORT;



// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


app.use(logTokenRequest); // Log all incoming requests
app.use(compression()); // Enable Gzip compression


// Apply the rate limiting middleware to all requests.
app.use(limiter)
// Log all incoming requests
// app.use((req, res, next) => {
//   logger.info(`${req.method} ${req.url}`);
//   next();
// });

//routes
app.use("/api/auth",authRoute);//
app.use("/api/user",userRoute);
app.use("/api/shift",shiftRoute);
app.use('/api/announcements',announcementRoutes);
app.use('/api/edit',profileEditRoute);
app.use('/api/request-shift',requestShift);
app.use('/api/user-manage',userManageRoute);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  connect();
  logger.info(`Server is running on port ${PORT}`); // Log server start
});


// logger.error('Test error log');

