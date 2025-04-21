import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import { createUserLogger } from "./createLogger.js";
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




export const logTokenRequest = (req, res, next) => {
    // Extract userId or adminId from the Authorization header
    const userId = req.headers["user-id"] || req.headers["admin-id"] || "anonymous"; // Default to 'anonymous' if no ID is provided
  
    // Determine if the user is an admin
    const isAdmin = req.headers["admin-id"] ? true : false;
  
    // Create the appropriate logger
    const userLogger = isAdmin ? createAdminLogger(userId) : createUserLogger(userId);
  
    // Log the request
    userLogger.info(`${req.method} ${req.url} - Request received`);
  
    // Proceed to the next middleware
    next();
  };


  