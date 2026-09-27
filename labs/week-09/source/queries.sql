-- ═══════════════════════════════════════════════════════════
-- queries.sql — คำสั่งค้นหาตอบโจทย์
-- 🏠 TODO W09-QUERY (CP22) · เขียนอย่างน้อย 8 ข้อ
-- ═══════════════════════════════════════════════════════════

PRAGMA foreign_keys = ON;

-- ① คำร้องทั้งหมด เรียงตามรหัส
SELECT *
FROM requests
ORDER BY id;


-- ② คำร้องที่ยังไม่ได้ดำเนินการ
SELECT
  id,
  request_type,
  location,
  details,
  priority,
  status
FROM requests
WHERE status = 'pending'
ORDER BY id;


-- ③ คำร้องเร่งด่วนที่ยังไม่เสร็จ
SELECT
  id,
  request_type,
  location,
  details,
  priority,
  status
FROM requests
WHERE priority = 'urgent'
  AND status <> 'completed'
ORDER BY id;


-- ④ ค้นคำร้องจากคำบางส่วนในรายละเอียด
SELECT
  id,
  location,
  details,
  status
FROM requests
WHERE details LIKE '%ไม่ทำงาน%'
ORDER BY id;


-- ⑤ คำร้องพร้อมชื่อผู้แจ้ง
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
ORDER BY r.id;


-- ⑥ คำร้องเฉพาะของภาควิชาวิศวกรรมซอฟต์แวร์
SELECT
  r.id,
  u.name AS requesterName,
  u.department,
  r.request_type AS requestType,
  r.location,
  r.details,
  r.status
FROM requests AS r
JOIN users AS u
  ON u.id = r.requester_id
WHERE u.department = 'วิศวกรรมซอฟต์แวร์'
ORDER BY r.id;


-- ⑦ รายชื่อผู้แจ้งที่ไม่ซ้ำกัน
SELECT DISTINCT
  u.name AS requesterName
FROM requests AS r
JOIN users AS u
  ON u.id = r.requester_id
ORDER BY requesterName;


-- ⑧ คำร้อง 3 รายการล่าสุด
SELECT
  id,
  request_type AS requestType,
  location,
  status,
  created_at AS createdAt
FROM requests
ORDER BY created_at DESC, id DESC
LIMIT 3;


-- ⭐ Challenge ─────────────────────────────────────────────

-- ⑨ นับจำนวนคำร้องแยกตามสถานะ
SELECT
  status,
  COUNT(*) AS requestCount
FROM requests
GROUP BY status
ORDER BY status;


-- ⑩ แสดงผู้ใช้ทุกคนและจำนวนคำร้อง
-- LEFT JOIN ทำให้ผู้ใช้ที่ยังไม่เคยแจ้งคำร้องแสดงด้วย
SELECT
  u.id,
  u.name AS requesterName,
  COUNT(r.id) AS requestCount
FROM users AS u
LEFT JOIN requests AS r
  ON r.requester_id = u.id
GROUP BY
  u.id,
  u.name
ORDER BY
  requestCount DESC,
  u.id;


-- ⑪ สร้าง Index ให้ค้นหาด้วย status เร็วขึ้น
CREATE INDEX IF NOT EXISTS idx_requests_status
ON requests(status);