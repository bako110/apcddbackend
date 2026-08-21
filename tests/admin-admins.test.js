import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apcdd-pro-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.NODE_ENV = 'test';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const { startTestDB, stopTestDB, clearTestDB } = await import('./setup.js');
const { app } = await import('../src/app.js');
const { Admin } = await import('../src/models/Admin.model.js');
const request = (await import('supertest')).default;

function signToken(admin) {
  return jwt.sign(
    { id: admin._id.toString(), email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
}

async function createAdmin({ role = 'manager', email = `admin-${Date.now()}@apcdd.org` } = {}) {
  const password = await bcrypt.hash('Password1234', 10);
  return Admin.create({ name: 'Test Admin', email, password, role });
}

describe('Admin management routes', () => {
  beforeAll(async () => {
    await startTestDB();
  });

  afterAll(async () => {
    await stopTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('rejects a manager trying to list admins', async () => {
    const manager = await createAdmin({ role: 'manager' });
    const res = await request(app)
      .get('/api/admin/admins')
      .set('Authorization', `Bearer ${signToken(manager)}`);

    expect(res.status).toBe(403);
  });

  it('allows a superadmin to create a manager', async () => {
    const superadmin = await createAdmin({ role: 'superadmin' });

    const res = await request(app)
      .post('/api/admin/admins')
      .set('Authorization', `Bearer ${signToken(superadmin)}`)
      .send({ name: 'Nouveau Manager', email: 'manager@apcdd.org', password: 'Password1234' });

    expect(res.status).toBe(201);
    expect(res.body.role).toBe('manager');
    expect(res.body).not.toHaveProperty('password');
  });

  it('prevents a superadmin from deleting their own account', async () => {
    const superadmin = await createAdmin({ role: 'superadmin' });

    const res = await request(app)
      .delete(`/api/admin/admins/${superadmin._id}`)
      .set('Authorization', `Bearer ${signToken(superadmin)}`);

    expect(res.status).toBe(400);
  });

  it('prevents deleting the last superadmin', async () => {
    const superadmin = await createAdmin({ role: 'superadmin', email: 'main@apcdd.org' });
    const otherSuperadmin = await createAdmin({ role: 'superadmin', email: 'other@apcdd.org' });

    const res = await request(app)
      .delete(`/api/admin/admins/${otherSuperadmin._id}`)
      .set('Authorization', `Bearer ${signToken(superadmin)}`);

    expect(res.status).toBe(200);

    const lastOne = await Admin.findById(superadmin._id);
    const secondDeleteAttempt = await request(app)
      .delete(`/api/admin/admins/${lastOne._id}`)
      .set('Authorization', `Bearer ${signToken(lastOne)}`);

    expect(secondDeleteAttempt.status).toBe(400);
  });
});
