import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;

before(async () => {
  await loadSeed();
  app = createApp();
});

const validRequest = {
  requesterName: 'ทดสอบ ระบบ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

describe('Campus Service API', () => {
  test('GET /api/requests ตอบ 200 และคืนข้อมูลเป็น Array', async () => {
    const res = await request(app)
      .get('/api/requests');

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  test('GET /api/requests/REQ-001 เมื่อพบคำร้อง ตอบ 200 และคืน ID ตรงกับ URL', async () => {
    const res = await request(app)
      .get('/api/requests/REQ-001');

    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'REQ-001');
  });

  test('GET /api/requests/REQ-999 เมื่อไม่พบคำร้อง ตอบ 404', async () => {
    const res = await request(app)
      .get('/api/requests/REQ-999');

    assert.equal(res.status, 404);
    assert.equal(typeof res.body.error, 'string');
  });

  test('POST /api/requests เมื่อข้อมูลถูกต้อง ตอบ 201 และกำหนดสถานะเริ่มต้นเป็น pending', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send(validRequest);

    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'pending');
    assert.equal(res.body.requesterName, validRequest.requesterName);
    assert.equal(res.body.requestType, validRequest.requestType);
    assert.ok(res.body.id);
  });

  test('POST /api/requests เมื่อข้อมูลไม่ครบ ตอบ 400 พร้อมรายละเอียดข้อผิดพลาด', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({
        requesterName: 'x',
      });

    assert.equal(res.status, 400);
    assert.equal(typeof res.body.error, 'string');
    assert.ok(Array.isArray(res.body.details));
    assert.ok(res.body.details.length > 0);
  });

  test('GET /api/requests เมื่อส่ง Origin ที่อนุญาต ต้องตอบ CORS Header ตรงกัน', async () => {
    const allowedOrigin =
      process.env.CORS_ORIGIN ?? 'http://localhost:5173';

    const res = await request(app)
      .get('/api/requests')
      .set('Origin', allowedOrigin);

    assert.equal(res.status, 200);
    assert.equal(
      res.headers['access-control-allow-origin'],
      allowedOrigin
    );
  });
});