import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

// Sur certaines machines Windows, le résolveur DNS système pointe vers 127.0.0.1
// (VPN/proxy local) sans rien à l'écoute sur le port 53, ce qui fait échouer
// toute résolution SRV (mongodb+srv://) avec ECONNREFUSED. On bascule vers des
// résolveurs publics dans ce cas précis, sans toucher à la config réseau du système.
if (env.MONGODB_URI.startsWith('mongodb+srv://') && dns.getServers().every((server) => server === '127.0.0.1')) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  logger.warn('Résolveur DNS système inutilisable (127.0.0.1) — bascule vers 8.8.8.8/1.1.1.1 pour la résolution MongoDB SRV');
}

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, 'MongoDB connection error');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection disconnected');
});

export async function connectDB() {
  await mongoose.connect(env.MONGODB_URI);
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
