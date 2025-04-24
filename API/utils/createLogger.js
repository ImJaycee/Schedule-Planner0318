import { createLogger, format, transports } from "winston";
import fs from "fs";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";

export const createUserLogger = (userId) => {
  const userLogDir = path.join("logs/employee/", userId);
  if (!fs.existsSync(userLogDir)) {
    fs.mkdirSync(userLogDir, { recursive: true });
  }

  return createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf(
        ({ timestamp, level, message }) =>
          `${timestamp} [${level.toUpperCase()}]: ${message}`
      )
    ),
    transports: [
      new DailyRotateFile({
        filename: path.join(userLogDir, "app-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        maxFiles: "7d", // Keep logs for 7 days
        level: "info",
      }),
      new DailyRotateFile({
        filename: path.join(userLogDir, "error-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        maxFiles: "7d", // Keep logs for 7 days
        level: "error",
      }),
    ],
  });
};

export const createAdminLogger = (AdminId) => {
  const adminLogDir = path.join("logs/admin/", AdminId);
  if (!fs.existsSync(adminLogDir)) {
    fs.mkdirSync(adminLogDir, { recursive: true });
  }

  return createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf(
        ({ timestamp, level, message }) =>
          `${timestamp} [${level.toUpperCase()}]: ${message}`
      )
    ),
    transports: [
      new DailyRotateFile({
        filename: path.join(adminLogDir, "app-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        maxFiles: "7d", // Keep logs for 7 days
        level: "info",
      }),
      new DailyRotateFile({
        filename: path.join(adminLogDir, "error-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        maxFiles: "7d", // Keep logs for 7 days
        level: "error",
      }),
    ],
  });
};