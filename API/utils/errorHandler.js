import logger from './logger.js'; // Import the logger

const errorHandler = (err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  logger.error(`${req.method} ${req.url} - ${errorMessage}`); // Log the error
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
};

export default errorHandler;