import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import {
  STAFF,
  loginAsStaff,
  tokenFor,
} from '../helpers/auth.js';

const app = createApp();

beforeEach(async () => {
  await loadSeed();
});

const validRequest = {
  requesterName: 'ทดสอบ อัตโนมัติ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดคำร้องยาวเกินสิบตัวอักษร',
  priority: 'normal',
};

describe('POST /api/auth/login', () => {
  test('อีเมลและรหัสผ่านถูก → 200 พร้อม token', async () => {
    const r = await request(app)
      .post('/api/auth/login')
      .send(STAFF);

    expect(r.status).toBe(200);
    expect(r.body.token.split('.')).toHaveLength(3);
    expect(r.body.user.role).toBe('staff');
  });

  test('รหัสผ่านผิด → 401', async () => {
    const r = await request(app)
      .post('/api/auth/login')
      .send({
        ...STAFF,
        password: 'nope1234',
      });

    expect(r.status).toBe(401);
  });

  test('อีเมลที่ไม่มี → 401 และข้อความเหมือนกรณีรหัสผ่านผิด', async () => {
    const wrongPassword = await request(app)
      .post('/api/auth/login')
      .send({
        ...STAFF,
        password: 'nope1234',
      });

    const unknownEmail = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'unknown@rmutl.ac.th',
        password: 'staff1234',
      });

    expect(unknownEmail.status).toBe(401);
    expect(unknownEmail.body.error).toBe(
      wrongPassword.body.error
    );
  });
});

describe('สิทธิ์ของ PUT / DELETE', () => {
  test('ไม่มี token → 401', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .send({ status: 'completed' });

    expect(r.status).toBe(401);
  });

  test('token ปลอม → 401', async () => {
    const fakeToken = tokenFor(
      'staff',
      'not-the-real-secret'
    );

    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set(
        'Authorization',
        `Bearer ${fakeToken}`
      )
      .send({ status: 'completed' });

    expect(r.status).toBe(401);
  });

  test('token ของ requester → 403', async () => {
    const requesterToken = tokenFor('requester');

    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set(
        'Authorization',
        `Bearer ${requesterToken}`
      )
      .send({ status: 'completed' });

    expect(r.status).toBe(403);
  });

  test('เจ้าหน้าที่ PUT → 200', async () => {
    const token = await loginAsStaff(app);

    const r = await request(app)
      .put('/api/requests/REQ-001')
      .set(
        'Authorization',
        `Bearer ${token}`
      )
      .send({ status: 'completed' });

    expect(r.status).toBe(200);
    expect(r.body.status).toBe('completed');
  });

  test('เจ้าหน้าที่ DELETE → 204', async () => {
    const token = await loginAsStaff(app);

    const r = await request(app)
      .delete('/api/requests/REQ-003')
      .set(
        'Authorization',
        `Bearer ${token}`
      );

    expect(r.status).toBe(204);
  });
});

describe('GET และ POST ยังเปิดให้ทุกคน', () => {
  test('GET ไม่มี token → 200', async () => {
    const r = await request(app)
      .get('/api/requests');

    expect(r.status).toBe(200);
  });

  test('POST ไม่มี token → 201', async () => {
    const r = await request(app)
      .post('/api/requests')
      .send(validRequest);

    expect(r.status).toBe(201);
  });
});