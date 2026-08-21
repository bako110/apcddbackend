import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';

process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apcdd-pro-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.NODE_ENV = 'test';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const { startTestDB, stopTestDB, clearTestDB } = await import('./setup.js');
const { app } = await import('../src/app.js');
const { Donation } = await import('../src/models/Donation.model.js');
const { Member } = await import('../src/models/Member.model.js');
const request = (await import('supertest')).default;

const adminToken = jwt.sign(
  { id: 'test-admin-id', email: 'admin@apcdd.org', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' },
);

describe('GET /api/admin/dashboard', () => {
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
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(401);
  });

  it('returns aggregated stats and recent activity', async () => {
    await Donation.create([
      { amount: 5000, donationPurpose: 'general', paymentMethod: 'mobile', anonymous: false },
      { amount: 10000, donationPurpose: 'education', paymentMethod: 'bank', anonymous: true },
    ]);
    await Member.create({
      membershipPlan: 'sympathisant',
      fullName: 'Test Member',
      email: 'test@example.com',
      phone: '12345678',
      city: 'Ouagadougou',
      profession: 'Étudiant',
      motivation: 'Motivation de test suffisamment longue.',
      termsAgreement: true,
    });

    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.stats.totalDonations).toBe(2);
    expect(res.body.stats.totalDonationAmount).toBe(15000);
    expect(res.body.stats.totalMembers).toBe(1);
    expect(res.body.recentDonations).toHaveLength(2);
    expect(res.body.recentMembers).toHaveLength(1);
    expect(Array.isArray(res.body.donationsByDay)).toBe(true);
  });
});
