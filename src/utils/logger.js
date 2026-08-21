import { createRequire } from 'module';
import pino from 'pino';
import { env } from '../config/env.js';

const require = createRequire(import.meta.url);

const isProduction = env.NODE_ENV === 'production';

let transport;
if (!isProduction) {
  try {
    require.resolve('pino-pretty');
    transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    };
  } catch {
    transport = undefined;
  }
}

export const logger = pino({
  level: isProduction ? 'info' : 'debug',
  transport,
});
