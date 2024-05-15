import 'dotenv/config';
import { logger } from './utils/logger';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import express, { Request, Response } from 'express';

dotenv.config();

/* Services Setup */

// Setup mongoose
logger.info(`Spinnging up ${process.env.STAGE} service`);
mongoose
  .connect(process.env.MONGODB_URI!, {
    dbName: process.env.MONGODB_DATABASE_NAME!,
  })
  .then(() => {
    logger.info('MongoDB Connected');
  })
  .catch((err) => {
    logger.error(`MongoDB Connection Error: ${err}`);
    process.exit(1);
  });

/* Api + Server */

enum ApiExceptionType {
  MALFORMED_REQUEST = 'Malformed Request',
  NOT_FOUND = 'Not Found',
  SERVER_ERROR = 'Server Error',
}

class ApiException extends Error {
  constructor(
    public type: ApiExceptionType,
    message?: string
  ) {
    super(message);
  }

  intoResponse(res: Response) {
    switch (this.type) {
      case ApiExceptionType.MALFORMED_REQUEST:
        res.status(400).json({ error: this.type });
        break;
      case ApiExceptionType.NOT_FOUND:
        res.status(404).json({ error: this.type });
        break;
      case ApiExceptionType.SERVER_ERROR:
        res.status(500).json({ error: this.type });
        break;
    }
  }
}

const app = express();

app.use(express.json());

/**
 * Example Get
 *
 * GET /
 */
app.get('/', async (req: Request, res: Response) => {
  try {
    throw new ApiException(ApiExceptionType.NOT_FOUND);
  } catch (error: any) {
    // NOTE: All fallible operations are wrapped in ApiException
    error.intoResponse(res);
  }
});

app.listen(process.env.LISTEN_PORT, () => {
  logger.info(`Server listening on port ${process.env.LISTEN_PORT}`);
});
