import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';

process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apcdd-pro-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.NODE_ENV = 'test';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const { startTestDB, stopTestDB, clearTestDB } = await import('./setup.js');
const { app } = await import('../src/app.js');
const { Member } = await import('../src/models/Member.model.js');
const request = (await import('supertest')).default;

const validPayload = {
  membershipPlan: 'actif',
  fullName: 'Aminata Traoré',
  email: 'aminata.traore@example.com',
  phone: '+22670123456',
  city: 'Ouagadougou',
  profession: 'Enseignante',
  motivation: "Je souhaite m'impliquer activement dans les projets culturels de l'association.",
  termsAgreement: true,
};

describe('POST /api/members', () => {
  beforeAll(async () => {
    await startTestDB();
  });

  afterAll(async () => {
    await stopTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('creates a member and returns a success message for a valid payload', async () => {
    const res = await request(app).post('/api/members').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Inscription réussie !' });

    const stored = await Member.findOne({ email: 'aminata.traore@example.com' });
    expect(stored).not.toBeNull();
    expect(stored.fullName).toBe('Aminata Traoré');
    expect(stored.membershipPlan).toBe('actif');
  });

  it('returns 400 for an invalid payload (missing required fields)', async () => {
    const res = await request(app)
      .post('/api/members')
      .send({
        membershipPlan: 'actif',
        fullName: 'A',
        email: 'not-an-email',
        termsAgreement: false,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('details');

    const stored = await Member.findOne({});
    expect(stored).toBeNull();
  });
});
