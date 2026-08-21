import { CORS_ORIGINS } from './env.js';

export const corsOptions = {
  origin(origin, callback) {
    // Autorise les requêtes sans origine (curl, apps mobiles, health checks)
    if (!origin || CORS_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
