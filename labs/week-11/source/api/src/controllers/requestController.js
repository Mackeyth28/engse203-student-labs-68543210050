import * as service from '../services/requestService.js';

/**
 * Controller รับผิดชอบ req, res และ HTTP Status Code
 * ส่วนการจัดการข้อมูลทั้งหมดอยู่ใน Service Layer
 */

/**
 * GET /api/requests
 * อ่านคำร้องทั้งหมด หรือกรองตาม status
 */
export function listRequests(req, res) {
  const { status } = req.query;

  const requests = service.findAll({
    status,
  });

  return res.status(200).json(requests);
}

/**
 * GET /api/requests/:id
 * อ่านคำร้องตาม ID
 */
export function getRequest(req, res) {
  const found = service.findById(
    req.params.id
  );

  if (!found) {
    return res.status(404).json({
      error: `ไม่พบคำร้องรหัส ${req.params.id}`,
    });
  }

  return res.status(200).json(found);
}

/**
 * POST /api/requests
 * สร้างคำร้องใหม่
 *
 * Service จะใช้ Transaction เพื่อสร้างผู้ใช้
 * และคำร้องให้สำเร็จพร้อมกัน
 */
export function createRequest(req, res) {
  const created = service.create(
    req.body
  );

  return res.status(201).json(created);
}

/**
 * PUT /api/requests/:id
 * เปลี่ยนสถานะของคำร้อง
 */
export function updateRequestStatus(req, res) {
  const allowedStatuses = [
    'pending',
    'in-progress',
    'completed',
  ];

  const { status } = req.body ?? {};

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      error:
        'สถานะต้องเป็น pending, in-progress หรือ completed',
    });
  }

  const updated = service.updateStatus(
    req.params.id,
    status
  );

  if (!updated) {
    return res.status(404).json({
      error: `ไม่พบคำร้องรหัส ${req.params.id}`,
    });
  }

  return res.status(200).json(updated);
}

/**
 * DELETE /api/requests/:id
 * ลบคำร้องตาม ID
 */
export function deleteRequest(req, res) {
  const removed = service.remove(
    req.params.id
  );

  if (!removed) {
    return res.status(404).json({
      error: `ไม่พบคำร้องรหัส ${req.params.id}`,
    });
  }

  return res.status(204).end();
}

/**
 * GET /api/users
 * Challenge: อ่านผู้ใช้พร้อมจำนวนคำร้อง
 */
export function listUsers(req, res) {
  const users = service.findAllUsers();

  return res.status(200).json(users);
}