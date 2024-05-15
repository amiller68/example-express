import * as winston from 'winston';
// Define the logger using winston
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
