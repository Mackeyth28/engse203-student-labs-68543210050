import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';

/**
 * Integration test — ยิง HTTP จริงผ่านทุกชั้น:
 * route → controller → service → SQLite
 *
 * vitest.config.js ตั้ง DB_FILE=':memory:' ไว้แล้ว
 * loadSeed() ทุกครั้งจึงได้ฐานข้อมูลใหม่ 5 รายการ
 * และไม่กระทบ api/data/campus.db
 */

const app = createApp();

beforeEach(async () => {
  await loadSeed();
});

const valid = {
  requesterName: 'ทดสอบ อัตโนมัติ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

describe('GET /api/requests', () => {
  test('คืน array 5 รายการจากข้อมูลตั้งต้น พร้อม 200', async () => {
    const r = await request(app).get('/api/requests');

    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(5);
  });

  test('คืน requesterName ไม่ใช่ requester_id', async () => {
    const r = await request(app).get('/api/requests');

    expect(r.body[0]).toHaveProperty('requesterName');
    expect(r.body[0]).not.toHaveProperty('requester_id');
  });

  test('กรอง ?status= ทำงาน', async () => {
    const r = await request(app).get('/api/requests?status=pending');

    expect(r.body.length).toBeGreaterThan(0);
    expect(r.body.every((x) => x.status === 'pending')).toBe(true);
  });

  test('SQL injection ผ่าน ?status= ไม่หลุด', async () => {
    const r = await request(app).get(
      "/api/requests?status=' OR '1'='1"
    );

    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(0);
  });
});

describe('GET /api/requests/:id', () => {
  test('พบ → 200', async () => {
    const r = await request(app).get('/api/requests/REQ-001');

    expect(r.status).toBe(200);
    expect(r.body.id).toBe('REQ-001');
  });

  test('ไม่พบ → 404', async () => {
    const r = await request(app).get('/api/requests/REQ-999');

    expect(r.status).toBe(404);
  });
});

describe('POST /api/requests', () => {
  test('ข้อมูลถูกต้อง → 201 · ได้รหัสถัดไป', async () => {
    const r = await request(app)
      .post('/api/requests')
      .send(valid);

    expect(r.status).toBe(201);
    expect(r.body.id).toBe('REQ-006');
  });

  test('ข้อมูลไม่ครบ → 400 พร้อมรายการ error', async () => {
    const r = await request(app)
      .post('/api/requests')
      .send({ requesterName: 'x' });

    expect(r.status).toBe(400);
    expect(Array.isArray(r.body.details)).toBe(true);
  });
});

describe('POST /api/requests — regression BUG #1', () => {
  test('ลบรายการกลางแล้วเพิ่มใหม่ → 201 และ ID ไม่ซ้ำ', async () => {
    await request(app)
      .delete('/api/requests/REQ-002')
      .expect(204);

    const r = await request(app)
      .post('/api/requests')
      .send(valid);

    expect(r.status).toBe(201);
    expect(r.body.id).toBe('REQ-006');
  });
});

describe('PUT /api/requests/:id', () => {
  test('เปลี่ยนสถานะ → 200 และค่าใหม่ถูกบันทึก', async () => {
    const updateResponse = await request(app)
      .put('/api/requests/REQ-001')
      .send({ status: 'completed' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('completed');

    const getResponse = await request(app)
      .get('/api/requests/REQ-001');

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.status).toBe('completed');
  });

  test('สถานะนอกรายการ → 400', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-001')
      .send({ status: 'done' });

    expect(r.status).toBe(400);
  });

  // Regression test สำหรับ BUG #3
  test('เปลี่ยนสถานะคำร้องที่ไม่มีอยู่ → 404', async () => {
    const r = await request(app)
      .put('/api/requests/REQ-999')
      .send({ status: 'completed' });

    expect(r.status).toBe(404);
  });
});

describe('DELETE /api/requests/:id', () => {
  test('ลบแล้ว GET ซ้ำ → 404', async () => {
    const deleteResponse = await request(app)
      .delete('/api/requests/REQ-003');

    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app)
      .get('/api/requests/REQ-003');

    expect(getResponse.status).toBe(404);
  });
});

describe('เส้นทางที่ไม่มีอยู่', () => {
  test('GET /api/nope → 404', async () => {
    const r = await request(app).get('/api/nope');

    expect(r.status).toBe(404);
  });
});