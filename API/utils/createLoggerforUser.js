import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';

export const createUserLogger = (userId) => {
  const userLogDir = path.join('logs/employee/', userId);
  if (!fs.existsSync(userLogDir)) {
    fs.mkdirSync(userLogDir, { recursive: true });
  }

  return createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: path.join(userLogDir, 'app.log'), level: 'info' }),
      new transports.File({ filename: path.join(userLogDir, 'error.log'), level: 'error' }),
    ],
  });
};