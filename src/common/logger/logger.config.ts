import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

const logDir = 'logs';

// Check if running on Vercel/serverless environment
const isServerless =
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NODE_ENV === 'production';

// Base transports array - always include console
const transports: winston.transport[] = [
  // Console log - always available
  new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize({ all: true }),
      winston.format.splat(),
      winston.format.errors({ stack: true }),
      nestWinstonModuleUtilities.format.nestLike('MyApp', {
        prettyPrint: true,
        colors: true,
      }),
    ),
  }),
];

// Only add file transports when NOT running on serverless
if (!isServerless) {
  transports.push(
    // File log - error.log (only in development/local)
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),

    // File log - combined.log (only in development/local)
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),
  );
}

export const winstonLoggerOptions: WinstonModuleOptions = {
  transports,
};
