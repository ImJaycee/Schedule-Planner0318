import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", // Default log level
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: "logs/app.log", level: "info" }), // Log all info-level and above logs
    new transports.File({ filename: "logs/error.log", level: "error" }), // Log only error-level logs
  ],
});

export default logger;
