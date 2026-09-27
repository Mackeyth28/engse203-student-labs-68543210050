import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
let createdRequestId;

before(async () => {
  await loadSeed();
  app = createApp();
});

const validRequest = {
  requesterName: 'ทดสอบ ฐานข้อมูล',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'ทดสอบการบันทึกข้อมูลลงฐานข้อมูล SQLite',
  priority: 'normal',
};

describe('Week 10 SQLite API', () => {
  test('GET /api/requests ตอบ 200 และคืนข้อมูลเป็น Array', async () => {
    const res = await request(app)
      .get('/api/requests');

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length > 0);
  });

  test('GET /api/requests คืน requesterName จากการ JOIN', async () => {
    const res = await request(app)
      .get('/api/requests');

    assert.equal(res.status, 200);
    assert.equal(typeof res.body[0].requesterName, 'string');
    assert.equal(res.body[0].requester_id, undefined);
  });

  test('GET /api/requests/REQ-001 เมื่อพบข้อมูล ตอบ 200', async () => {
    const res = await request(app)
      .get('/api/requests/REQ-001');

    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'REQ-001');
    assert.equal(typeof res.body.requesterName, 'string');
  });

  test('GET /api/requests/REQ-999 เมื่อไม่พบข้อมูล ตอบ 404', async () => {
    const res = await request(app)
      .get('/api/requests/REQ-999');

    assert.equal(res.status, 404);
    assert.equal(typeof res.body.error, 'string');
  });

  test('POST /api/requests สร้างคำร้องในฐานข้อมูลและตอบ 201', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send(validRequest);

    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'pending');
    assert.equal(res.body.requesterName, validRequest.requesterName);
    assert.ok(res.body.id);

    createdRequestId = res.body.id;
  });

  test('POST /api/requests เมื่อข้อมูลไม่ครบ ตอบ 400', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({
        requesterName: 'x',
      });

    assert.equal(res.status, 400);
    assert.equal(typeof res.body.error, 'string');
  });

  test('PUT /api/requests/:id เปลี่ยนสถานะในฐานข้อมูลได้', async () => {
    assert.ok(createdRequestId);

    const res = await request(app)
      .put(`/api/requests/${createdRequestId}`)
      .send({
        status: 'in-progress',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'in-progress');
  });

  test('GET /api/requests ป้องกัน SQL injection ด้วย Parameterized Query', async () => {
    const res = await request(app)
      .get('/api/requests')
      .query({
        status: "x' OR '1'='1",
      });

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body.length, 0);
  });

  test('DELETE /api/requests/:id ลบข้อมูลและตอบ 204', async () => {
    assert.ok(createdRequestId);

    const res = await request(app)
      .delete(`/api/requests/${createdRequestId}`);

    assert.equal(res.status, 204);
  });
});
``