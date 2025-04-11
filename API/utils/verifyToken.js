import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import { createUserLogger } from "./createLoggerforUser.js";
// Verify JWT token
export const verifyToken = (req, res, next) => {
    
    let token = req.cookies.access_token || req.headers.authorization?.split(" ")[1]; // Support both cookie and header
    if (!token) {
        return next(createError(401, "Authentication required"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(createError(403, "Invalid token"));
        req.user = user;
        next();
    });
};

// Allow any authenticated user
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, (error) => {
        if (error) return next(error);
        if (!req.user) return next(createError(403, "Authorization failed, user data missing"));

        return next();
    });
};

// Allow only admin users
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, (error) => {
        if (error) return next(error);
        if (req.user?.isAdmin) return next(); // Allow admins

        return next(createError(403, "You are not authorized!"));
    });
};




// Middleware to log all incoming requests
export const logTokenRequest = ((req, res, next) => {
    // Extract userId from the Authorization header
    const userId = req.headers["user-id"] || "anonymous"; // Default to 'anonymous' if no userId is provided

  // Create a logger for the user
  const userLogger = createUserLogger(userId);

  // Log the request
  userLogger.info(`${req.method} ${req.url} - Request received`);

  // Proceed to the next middleware
  next();
  }); 