import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';

// Les variables d'environnement requises doivent être définies avant que
// src/config/env.js ne soit importé (import transitif via app.js), sinon
// le process fait un fail-fast (process.exit) car MONGODB_URI/JWT_SECRET
// manqueraient.
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apcdd-pro-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.NODE_ENV = 'test';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const { startTestDB, stopTestDB, clearTestDB } = await import('./setup.js');
const { app } = await import('../src/app.js');
const { Content } = await import('../src/models/Content.model.js');
const request = (await import('supertest')).default;

describe('GET /api/content', () => {
  beforeAll(async () => {
    await startTestDB();
  });

  afterAll(async () => {
    await stopTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('returns 404 when no content document exists yet', async () => {
    const res = await request(app).get('/api/content');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns the singleton content document with about and stats', async () => {
    await Content.create({
      about: {
        title: "À propos de l'APCDD",
        description: 'Une association engagée pour la culture et le développement durable.',
      },
      stats: {
        activeMembers: 100,
        projectsDone: 12,
        treesPlanted: 5000,
        villagesTouched: 8,
      },
    });

    const res = await request(app).get('/api/content');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      about: {
        title: "À propos de l'APCDD",
        subtitle: '',
        description: 'Une association engagée pour la culture et le développement durable.',
      },
      stats: {
        activeMembers: 100,
        projectsDone: 12,
        treesPlanted: 5000,
        villagesTouched: 8,
      },
    });
  });
});
