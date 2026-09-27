-- Campus Service Request Database
-- ENGSE203 Week 09

PRAGMA foreign_keys = ON;

-- ลบตารางลูกก่อนตารางแม่ เพื่อให้รันซ้ำได้
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS users;

-- ตารางผู้ใช้งาน
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

-- ตารางคำร้อง
CREATE TABLE requests (
  id TEXT PRIMARY KEY,
  requester_id INTEGER NOT NULL,

  request_type TEXT NOT NULL
    CHECK (
      request_type IN (
        'แจ้งซ่อม',
        'บริการบัญชีผู้ใช้',
        'ขอใช้อุปกรณ์',
        'อื่น ๆ'
      )
    ),

  location TEXT NOT NULL,
  details TEXT NOT NULL,

  priority TEXT NOT NULL DEFAULT 'normal'
    CHECK (
      priority IN (
        'normal',
        'urgent'
      )
    ),

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (
      status IN (
        'pending',
        'in-progress',
        'completed'
      )
    ),

  created_at TEXT NOT NULL
    DEFAULT (datetime('now', 'localtime')),

  FOREIGN KEY (requester_id)
    REFERENCES users(id)
);

-- ข้อมูลผู้ใช้ตั้งต้น
INSERT INTO users (
  name,
  department,
  email
) VALUES
  (
    'สมชาย ใจดี',
    'วิศวกรรมซอฟต์แวร์',
    'somchai@rmutl.ac.th'
  ),
  (
    'สุภาวดี รักเรียน',
    'วิศวกรรมซอฟต์แวร์',
    'supawadee@rmutl.ac.th'
  ),
  (
    'ธนกฤต ตั้งใจ',
    'วิศวกรรมไฟฟ้า',
    'thanakrit@rmutl.ac.th'
  ),
  (
    'ปรียา ขยันยิ่ง',
    'สำนักวิทยบริการ',
    'preeya@rmutl.ac.th'
  );

-- ข้อมูลคำร้องตั้งต้น 8 รายการ
INSERT INTO requests (
  id,
  requester_id,
  request_type,
  location,
  details,
  priority,
  status
) VALUES
  (
    'REQ-001',
    1,
    'แจ้งซ่อม',
    'ห้องปฏิบัติการ 301',
    'เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า',
    'urgent',
    'pending'
  ),
  (
    'REQ-002',
    2,
    'บริการบัญชีผู้ใช้',
    'อาคารวิศวกรรม',
    'เข้าสู่ระบบห้องปฏิบัติการไม่ได้',
    'normal',
    'in-progress'
  ),
  (
    'REQ-003',
    3,
    'ขอใช้อุปกรณ์',
    'ห้องประชุม 2',
    'ขอยืมโปรเจกเตอร์',
    'normal',
    'completed'
  ),
  (
    'REQ-004',
    1,
    'แจ้งซ่อม',
    'ห้องปฏิบัติการ 302',
    'คอมพิวเตอร์เครื่องที่ 5 เปิดไม่ติด',
    'urgent',
    'pending'
  ),
  (
    'REQ-005',
    4,
    'อื่น ๆ',
    'ห้องสมุด ชั้น 2',
    'ขอเพิ่มปลั๊กไฟบริเวณโต๊ะอ่านหนังสือ',
    'normal',
    'pending'
  ),
  (
    'REQ-006',
    2,
    'แจ้งซ่อม',
    'ห้องปฏิบัติการ 401',
    'ไฟในห้องกะพริบตลอดเวลา',
    'normal',
    'pending'
  ),
  (
    'REQ-007',
    3,
    'ขอใช้อุปกรณ์',
    'อาคารวิศวกรรมไฟฟ้า',
    'ขอยืมไมโครโฟนสำหรับกิจกรรม',
    'urgent',
    'in-progress'
  ),
  (
    'REQ-008',
    4,
    'อื่น ๆ',
    'ห้องสมุด ชั้น 1',
    'ขอเพิ่มเก้าอี้บริเวณโต๊ะอ่านหนังสือ',
    'normal',
    'completed'
  );

-- ตรวจสอบผลลัพธ์
SELECT COUNT(*) AS userCount
FROM users;

SELECT COUNT(*) AS requestCount
FROM requests;

SELECT *
FROM users
ORDER BY id;

SELECT *
FROM requests
ORDER BY id;