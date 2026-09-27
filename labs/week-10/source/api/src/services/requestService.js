import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

/**
 * Week 10
 * Service Layer ที่อ่านและเขียนข้อมูลจาก SQLite
 *
 * ชื่อและ Signature ของฟังก์ชันเดิมยังเหมือน Week 07
 * เพื่อให้ Controller และ Frontend ใช้งานต่อได้โดยไม่ต้องแก้
 */

const HERE = path.dirname(
  fileURLToPath(import.meta.url)
);

const API_ROOT = path.resolve(HERE, '../..');

const DB_FILE =
  process.env.DB_FILE ??
  path.join(API_ROOT, 'data', 'campus.db');

const SCHEMA_FILE = path.join(
  API_ROOT,
  'data',
  'schema.sql'
);

let db;

/**
 * เปิดฐานข้อมูลและเตรียมตาราง
 *
 * ถ้ายังไม่มีตาราง requests ระบบจะสร้างตาราง
 * และข้อมูลตั้งต้นจาก schema.sql
 */
export async function loadSeed() {
  if (db) {
    db.close();
  }

  db = new DatabaseSync(DB_FILE);

  // SQLite ต้องเปิด Foreign Key ทุกครั้งที่เปิด Connection
  db.exec('PRAGMA foreign_keys = ON');

  const table = db
    .prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name = 'requests'
    `)
    .get();

  if (!table) {
    const schema = readFileSync(
      SCHEMA_FILE,
      'utf8'
    );

    db.exec(schema);

    // ยืนยันอีกครั้งหลังสร้างฐานข้อมูล
    db.exec('PRAGMA foreign_keys = ON');
  }

  // Challenge: Index สำหรับการค้นหาตาม status
  // ใช้ IF NOT EXISTS เพื่อให้รันซ้ำได้
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_requests_status
    ON requests(status)
  `);
}

/**
 * คืนรายการคำร้องทั้งหมด
 *
 * JOIN users เพื่อแปลง requester_id
 * ให้เป็น requesterName สำหรับ Frontend
 */
export function findAll({ status } = {}) {
  const baseQuery = `
    SELECT
      r.id,
      u.name AS requesterName,
      r.request_type AS requestType,
      r.location,
      r.details,
      r.priority,
      r.status,
      r.created_at AS createdAt
    FROM requests AS r
    JOIN users AS u
      ON u.id = r.requester_id
  `;

  if (status) {
    return db
      .prepare(`
        ${baseQuery}
        WHERE r.status = ?
        ORDER BY r.id
      `)
      .all(status);
  }

  return db
    .prepare(`
      ${baseQuery}
      ORDER BY r.id
    `)
    .all();
}

/**
 * คืนคำร้องตาม ID
 *
 * ถ้าไม่พบจะคืน null
 */
export function findById(id) {
  const request = db
    .prepare(`
      SELECT
        r.id,
        u.name AS requesterName,
        r.request_type AS requestType,
        r.location,
        r.details,
        r.priority,
        r.status,
        r.created_at AS createdAt
      FROM requests AS r
      JOIN users AS u
        ON u.id = r.requester_id
      WHERE r.id = ?
    `)
    .get(id);

  return request ?? null;
}

/**
 * สร้าง Request ID ที่ไม่ซ้ำ
 */
function createRequestId() {
  let id;

  do {
    const time = Date.now()
      .toString(36)
      .toUpperCase();

    const random = Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase();

    id = `REQ-${time}-${random}`;
  } while (
    db
      .prepare(`
        SELECT id
        FROM requests
        WHERE id = ?
      `)
      .get(id)
  );

  return id;
}

/**
 * สร้าง Email ชั่วคราวที่ไม่ซ้ำ
 *
 * ใช้เฉพาะกรณีที่ Frontend ส่งชื่อผู้แจ้งใหม่
 * ซึ่งยังไม่มีในตาราง users
 */
function createPlaceholderEmail() {
  const time = Date.now().toString(36);

  const random = Math.random()
    .toString(36)
    .slice(2, 8);

  return `user-${time}-${random}@example.local`;
}

/**
 * เพิ่มคำร้องใหม่ด้วย Transaction
 *
 * Frontend ส่ง requesterName มา
 * แต่ฐานข้อมูลเก็บ requester_id
 *
 * ขั้นตอน:
 * 1. เริ่ม Transaction
 * 2. ค้นหาผู้ใช้จากชื่อ
 * 3. หากไม่พบ ให้สร้างผู้ใช้ใหม่
 * 4. สร้างคำร้องด้วย requester_id
 * 5. Commit หากทุกอย่างสำเร็จ
 * 6. Rollback หากมีข้อผิดพลาด
 */
export function create(input) {
  db.exec('BEGIN TRANSACTION');

  try {
    const requesterName = input.requesterName.trim();

    let user = db
      .prepare(`
        SELECT
          id,
          name
        FROM users
        WHERE name = ?
      `)
      .get(requesterName);

    if (!user) {
      const result = db
        .prepare(`
          INSERT INTO users (
            name,
            department,
            email
          )
          VALUES (?, ?, ?)
        `)
        .run(
          requesterName,
          'ไม่ระบุ',
          createPlaceholderEmail()
        );

      user = {
        id: Number(result.lastInsertRowid),
        name: requesterName,
      };
    }

    const id = createRequestId();

    db.prepare(`
      INSERT INTO requests (
        id,
        requester_id,
        request_type,
        location,
        details,
        priority,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      id,
      user.id,
      input.requestType,
      input.location.trim(),
      input.details.trim(),
      input.priority
    );

    db.exec('COMMIT');

    return findById(id);
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

/**
 * เปลี่ยนสถานะคำร้อง
 *
 * ถ้าไม่พบ ID จะคืน null
 */
export function updateStatus(id, status) {
  const result = db
    .prepare(`
      UPDATE requests
      SET status = ?
      WHERE id = ?
    `)
    .run(status, id);

  if (result.changes === 0) {
    return null;
  }

  return findById(id);
}

/**
 * ลบคำร้องตาม ID
 *
 * คืน true เมื่อลบสำเร็จ
 * คืน null เมื่อไม่พบข้อมูล
 */
export function remove(id) {
  const result = db
    .prepare(`
      DELETE FROM requests
      WHERE id = ?
    `)
    .run(id);

  return result.changes > 0
    ? true
    : null;
}

/**
 * Challenge: คืนรายการผู้ใช้ทั้งหมด
 *
 * LEFT JOIN ทำให้ผู้ใช้ที่ยังไม่มีคำร้อง
 * ยังคงปรากฏในผลลัพธ์
 */
export function findAllUsers() {
  return db
    .prepare(`
      SELECT
        u.id,
        u.name,
        u.department,
        u.email,
        COUNT(r.id) AS requestCount
      FROM users AS u
      LEFT JOIN requests AS r
        ON r.requester_id = u.id
      GROUP BY
        u.id,
        u.name,
        u.department,
        u.email
      ORDER BY u.id
    `)
    .all();
}