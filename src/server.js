import { env } from './config/env.js';
import { connectDB } from './config/database.js';
import { app } from './app.js';
import { logger } from './utils/logger.js';

let server;

async function start() {
  await connectDB();

  server = app.listen(env.PORT, () => {
    logger.info(`APCDD Pro API listening on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

function shutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully...`);

  if (!server) {
    process.exit(0);
    return;
  }

  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Sécurité : force l'arrêt si la fermeture prend trop de temps
  setTimeout(() => {
    logger.warn('Forced shutdown after timeout');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
