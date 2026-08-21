import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';

process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apcdd-pro-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.NODE_ENV = 'test';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const { startTestDB, stopTestDB, clearTestDB } = await import('./setup.js');
const { app } = await import('../src/app.js');
const { Member } = await import('../src/models/Member.model.js');
const request = (await import('supertest')).default;

const adminToken = jwt.sign(
  { id: 'test-admin-id', email: 'admin@apcdd.org', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' },
);

const memberPayload = {
  membershipPlan: 'sympathisant',
  status: 'pending',
  fullName: 'Kaoula Adjara',
  email: 'adjara@example.com',
  phone: '54867026',
  city: 'Ouagadougou',
  profession: 'Étudiante',
  motivation: "Parce que j'aime mon identité",
  termsAgreement: true,
};

describe('Admin members routes', () => {
  beforeAll(async () => {
    await startTestDB();
  });

  afterAll(async () => {
    await stopTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('rejects requests without a valid admin token', async () => {
    const member = await Member.create(memberPayload);
    const res = await request(app).get(`/api/admin/members/${member._id}`);
    expect(res.status).toBe(401);
  });

  it('returns a member by id for an authenticated admin', async () => {
    const member = await Member.create(memberPayload);

    const res = await request(app)
      .get(`/api/admin/members/${member._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.fullName).toBe('Kaoula Adjara');
  });

  it('returns 404 for a non-existent member id', async () => {
    const res = await request(app)
      .get('/api/admin/members/659c1f1f1f1f1f1f1f1f1f1f')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it('updates a member status to approved', async () => {
    const member = await Member.create(memberPayload);

    const res = await request(app)
      .patch(`/api/admin/members/${member._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'approved' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('approved');

    const stored = await Member.findById(member._id);
    expect(stored.status).toBe('approved');
  });

  it('rejects an invalid status value', async () => {
    const member = await Member.create(memberPayload);

    const res = await request(app)
      .patch(`/api/admin/members/${member._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'not-a-real-status' });

    expect(res.status).toBe(400);
  });
});
