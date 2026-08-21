import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import pinoHttp from 'pino-http';
import { corsOptions } from './config/cors.js';
import { logger } from './utils/logger.js';
import routes from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(mongoSanitize());
app.use(pinoHttp({ logger }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export { app };
