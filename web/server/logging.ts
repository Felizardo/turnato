import { LoggingWinston } from '@google-cloud/logging-winston';
import winston from 'winston';
import expressWinston from 'express-winston';

export function setupLogging(app, name) {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.info('GOOGLE_APPLICATION_CREDENTIALS env not found, skipping stackdriver logging.');
    return;
  }
  const loggingWinston = new LoggingWinston({
    prefix: name,
    logName: name,
    serviceContext: {
      service: name,
      version: 'latest',
    },
    labels: { name },
  });
  const logger = winston.createLogger({
    level: 'info',
    transports: [loggingWinston],
  });
  app.use(
    expressWinston.logger({
      winstonInstance: logger,
      meta: true,
    }),
  );
}
