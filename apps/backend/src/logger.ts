import { createLogger, format, transports } from 'winston';

export function getLogger() {
  return createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    transports: [
      new transports.Console(),
    ],
  });
}
