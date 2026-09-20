# API Contract: Campus Service Request

## ข้อมูลเอกสาร

- ชื่อระบบ: Campus Service Request
- เวอร์ชัน API: 2.0.0
- Base URL สำหรับ Development: `http://localhost:3001`
- รูปแบบข้อมูล: JSON
- ผู้จัดทำ: Thapakorn Jaingam
- รหัสนักศึกษา: 68543210050

---

# 1. โครงสร้างข้อมูลและชนิดข้อมูล

ระบบจัดเก็บข้อมูลคำร้องในรูปแบบ Object ดังนี้

| Field | ชนิดข้อมูล | จำเป็น | รายละเอียด | ตัวอย่าง |
|---|---|---:|---|---|
| `id` | String | ใช่ | รหัสคำร้อง สร้างโดยระบบและต้องไม่ซ้ำกัน | `REQ-001` |
| `requesterName` | String | ใช่ | ชื่อผู้แจ้งคำร้อง | `สมชาย ใจดี` |
| `requestType` | String | ใช่ | ประเภทของคำร้อง | `แจ้งซ่อม` |
| `location` | String | ใช่ | สถานที่ที่เกี่ยวข้องกับคำร้อง | `ห้องปฏิบัติการ 301` |
| `details` | String | ใช่ | รายละเอียดของคำร้อง | `เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า` |
| `priority` | String | ใช่ | ระดับความเร่งด่วน | `normal` |
| `status` | String | ใช่ | สถานะปัจจุบันของคำร้อง | `pending` |

## ค่าที่ระบบยอมรับ

### `priority`

ค่าที่ระบบรองรับให้ยึดตาม Validation ของโปรเจกต์ เช่น:

```text
normal
urgent
```

### `status`

ระบบรองรับเฉพาะ 3 ค่า:

```text
pending
in-progress
completed
```

คำร้องที่สร้างใหม่จะมีสถานะเริ่มต้นเป็น:

```text
pending
```

## ตัวอย่างข้อมูลคำร้อง

```json
{
  "id": "REQ-001",
  "requesterName": "สมชาย ใจดี",
  "requestType": "แจ้งซ่อม",
  "location": "ห้องปฏิบัติการ 301",
  "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
  "priority": "urgent",
  "status": "pending"
}
```

---

# 2. รายการ Endpoint

| Method | Path | การทำงาน |
|---|---|---|
| `GET` | `/api/requests` | อ่านคำร้องทั้งหมด |
| `GET` | `/api/requests/:id` | อ่านคำร้องตามรหัส |
| `POST` | `/api/requests` | สร้างคำร้องใหม่ |
| `PUT` | `/api/requests/:id` | เปลี่ยนสถานะคำร้อง |
| `DELETE` | `/api/requests/:id` | ลบคำร้องตามรหัส |

---

# 3. GET `/api/requests`

ใช้สำหรับอ่านรายการคำร้องทั้งหมด

## Request

```http
GET /api/requests HTTP/1.1
Host: localhost:3001
Accept: application/json
```

Endpoint นี้ไม่ต้องส่ง Request Body

## Response สำเร็จ

### Status

```text
200 OK
```

### Body

```json
[
  {
    "id": "REQ-001",
    "requesterName": "สมชาย ใจดี",
    "requestType": "แจ้งซ่อม",
    "location": "ห้องปฏิบัติการ 301",
    "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
    "priority": "urgent",
    "status": "pending"
  },
  {
    "id": "REQ-002",
    "requesterName": "สุภาวดี รักเรียน",
    "requestType": "บริการบัญชีผู้ใช้",
    "location": "อาคารวิศวกรรมซอฟต์แวร์",
    "details": "เข้าสู่ระบบห้องปฏิบัติการไม่ได้",
    "priority": "normal",
    "status": "in-progress"
  }
]
```

## กรณีไม่มีข้อมูล

ระบบตอบ Array ว่าง:

```json
[]
```

โดยยังใช้ Status:

```text
200 OK
```

---

# 4. GET `/api/requests/:id`

ใช้สำหรับอ่านรายละเอียดคำร้องตามรหัส

## Path Parameter

| Parameter | ชนิดข้อมูล | รายละเอียด | ตัวอย่าง |
|---|---|---|---|
| `id` | String | รหัสคำร้องที่ต้องการค้นหา | `REQ-001` |

## Request ตัวอย่าง

```http
GET /api/requests/REQ-001 HTTP/1.1
Host: localhost:3001
Accept: application/json
```

## Response เมื่อพบข้อมูล

### Status

```text
200 OK
```

### Body

```json
{
  "id": "REQ-001",
  "requesterName": "สมชาย ใจดี",
  "requestType": "แจ้งซ่อม",
  "location": "ห้องปฏิบัติการ 301",
  "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
  "priority": "urgent",
  "status": "pending"
}
```

## Response เมื่อไม่พบข้อมูล

### Status

```text
404 Not Found
```

### Body

```json
{
  "error": "ไม่พบคำร้องรหัส REQ-999"
}
```

---

# 5. POST `/api/requests`

ใช้สำหรับสร้างคำร้องใหม่

ระบบเป็นผู้สร้าง `id` และกำหนด `status` เริ่มต้นเป็น `pending` ดังนั้น Client ไม่ต้องส่งสอง Field นี้

## Request Body

```json
{
  "requesterName": "Thapakorn Jaingam",
  "requestType": "แจ้งซ่อม",
  "location": "ห้องปฏิบัติการ 401",
  "details": "เครื่องคอมพิวเตอร์ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้",
  "priority": "normal"
}
```

## Request ตัวอย่าง

```http
POST /api/requests HTTP/1.1
Host: localhost:3001
Content-Type: application/json
Accept: application/json
```

```json
{
  "requesterName": "Thapakorn Jaingam",
  "requestType": "แจ้งซ่อม",
  "location": "ห้องปฏิบัติการ 401",
  "details": "เครื่องคอมพิวเตอร์ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้",
  "priority": "normal"
}
```

## Response เมื่อสร้างสำเร็จ

### Status

```text
201 Created
```

### Body

```json
{
  "id": "REQ-ตัวอย่างรหัสที่ระบบสร้าง",
  "requesterName": "Thapakorn Jaingam",
  "requestType": "แจ้งซ่อม",
  "location": "ห้องปฏิบัติการ 401",
  "details": "เครื่องคอมพิวเตอร์ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้",
  "priority": "normal",
  "status": "pending"
}
```

> ให้นำรหัสและ Response จริงจาก Postman มาแทนตัวอย่างด้านบน

## Response เมื่อข้อมูลไม่ถูกต้อง

ตัวอย่าง Request ที่ข้อมูลไม่ครบ:

```json
{
  "requesterName": "x"
}
```

### Status

```text
400 Bad Request
```

### Body

```json
{
  "error": "ข้อมูลไม่ถูกต้อง",
  "details": [
    "ชื่อผู้แจ้งสั้นเกินไป",
    "ประเภทคำร้องไม่ถูกต้อง",
    "กรุณาระบุสถานที่",
    "รายละเอียดสั้นเกินไป",
    "ระดับความเร่งด่วนไม่ถูกต้อง"
  ]
}
```

> ข้อความใน `details` ต้องคัดลอกจาก Response จริงของโปรเจกต์

---

# 6. PUT `/api/requests/:id`

ใช้สำหรับเปลี่ยนสถานะของคำร้อง

## Path Parameter

| Parameter | ชนิดข้อมูล | รายละเอียด | ตัวอย่าง |
|---|---|---|---|
| `id` | String | รหัสคำร้องที่ต้องการเปลี่ยนสถานะ | `REQ-001` |

## Request Body

```json
{
  "status": "in-progress"
}
```

ค่าที่รองรับ:

```text
pending
in-progress
completed
```

## Request ตัวอย่าง

```http
PUT /api/requests/REQ-001 HTTP/1.1
Host: localhost:3001
Content-Type: application/json
Accept: application/json
```

```json
{
  "status": "in-progress"
}
```

## Response เมื่อเปลี่ยนสถานะสำเร็จ

### Status

```text
200 OK
```

### Body

```json
{
  "id": "REQ-001",
  "requesterName": "สมชาย ใจดี",
  "requestType": "แจ้งซ่อม",
  "location": "ห้องปฏิบัติการ 301",
  "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
  "priority": "urgent",
  "status": "in-progress"
}
```

## Response เมื่อสถานะไม่ถูกต้อง

### Request Body

```json
{
  "status": "มั่ว"
}
```

### Status

```text
400 Bad Request
```

### Body

```json
{
  "error": "สถานะไม่ถูกต้อง"
}
```

## Response เมื่อไม่พบคำร้อง

ตัวอย่าง:

```text
PUT /api/requests/REQ-999
```

### Status

```text
404 Not Found
```

### Body

```json
{
  "error": "ไม่พบคำร้องรหัส REQ-999"
}
```

> ให้แทนข้อความ Error ด้วย Response จริงหลังจากทดสอบ CP13 ใน Postman

---

# 7. DELETE `/api/requests/:id`

ใช้สำหรับลบคำร้องตามรหัส

## Path Parameter

| Parameter | ชนิดข้อมูล | รายละเอียด | ตัวอย่าง |
|---|---|---|---|
| `id` | String | รหัสคำร้องที่ต้องการลบ | `REQ-003` |

## Request ตัวอย่าง

```http
DELETE /api/requests/REQ-003 HTTP/1.1
Host: localhost:3001
```

Endpoint นี้ไม่ต้องส่ง Request Body

## Response เมื่อลบสำเร็จ

### Status

```text
204 No Content
```

Response ไม่มี Body:

```text
0 Bytes
```

## Response เมื่อไม่พบคำร้อง

### Status

```text
404 Not Found
```

### Body

```json
{
  "error": "ไม่พบคำร้องรหัส REQ-999"
}
```

---

# 8. Status Code

| Status Code | ความหมาย | ใช้ในกรณี |
|---:|---|---|
| `200 OK` | คำขอสำเร็จ | GET สำเร็จ หรือ PUT สำเร็จ |
| `201 Created` | สร้างข้อมูลสำเร็จ | POST สร้างคำร้องใหม่ |
| `204 No Content` | สำเร็จและไม่มี Response Body | DELETE สำเร็จ |
| `400 Bad Request` | ข้อมูลที่ส่งมาไม่ถูกต้อง | Validation ไม่ผ่าน หรือ Status ไม่ถูกต้อง |
| `404 Not Found` | ไม่พบ Resource หรือ Route | ไม่พบ Request ID หรือไม่มี Route ตรง |
| `500 Internal Server Error` | เกิดข้อผิดพลาดภายใน Server | Error ที่ระบบไม่ได้คาดไว้ |

---

# 9. รูปแบบ Error

API ตอบ Error ในรูปแบบ JSON

## Error ทั่วไป

```json
{
  "error": "ข้อความอธิบายข้อผิดพลาด"
}
```

## Validation Error

```json
{
  "error": "ข้อมูลไม่ถูกต้อง",
  "details": [
    "รายละเอียดข้อผิดพลาดรายการที่ 1",
    "รายละเอียดข้อผิดพลาดรายการที่ 2"
  ]
}
```

## Route ที่ไม่มีอยู่

ตัวอย่าง Request:

```text
GET /api/unknown
```

Response:

```json
{
  "error": "ไม่พบเส้นทาง GET /api/unknown"
}
```

Status:

```text
404 Not Found
```

## Internal Server Error

ใน Production ผู้ใช้จะได้รับข้อความทั่วไป:

```json
{
  "error": "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์"
}
```

ระบบต้องไม่ส่ง Stack Trace ให้ Client ใน Production

สำหรับ Development ระบบอาจแนบ Stack Trace แบบย่อเพื่อช่วยตรวจสอบข้อผิดพลาด แต่ข้อมูลดังกล่าวต้องไม่ปรากฏเมื่อ:

```env
NODE_ENV=production
```

---

# 10. CORS

API อนุญาตให้ Frontend Origin นี้เรียกใช้งาน:

```text
http://localhost:5173
```

ค่าดังกล่าวกำหนดผ่าน Environment Variable:

```env
CORS_ORIGIN=http://localhost:5173
```

ตัวอย่าง Response Header:

```http
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
```

API รองรับ Preflight Request ด้วย Method:

```text
OPTIONS
```

ตัวอย่าง Method ที่อนุญาต:

```text
GET
HEAD
PUT
PATCH
POST
DELETE
```

---

# 11. Environment Variables

## ฝั่ง API

ไฟล์ที่ใช้จริง:

```text
api/.env
```

ตัวอย่าง:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

รายละเอียด:

| Variable | ตัวอย่าง | รายละเอียด |
|---|---|---|
| `PORT` | `3001` | พอร์ตของ Express API |
| `CORS_ORIGIN` | `http://localhost:5173` | Origin ของ Frontend ที่ได้รับอนุญาต |
| `NODE_ENV` | `development` | Environment ปัจจุบันของ Server |

ไฟล์สำหรับ Commit:

```text
api/.env.example
```

ห้าม Commit:

```text
api/.env
```

## ฝั่ง Frontend

ไฟล์ที่ใช้จริง:

```text
frontend/.env.local
```

ตัวอย่าง:

```env
VITE_API_BASE_URL=http://localhost:3001
```

รายละเอียด:

| Variable | ตัวอย่าง | รายละเอียด |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001` | Base URL ที่ Frontend ใช้เรียก API |

ไฟล์สำหรับ Commit:

```text
frontend/.env.example
```

ห้าม Commit:

```text
frontend/.env.local
```

---

# 12. วิธีติดตั้ง Dependencies

## ติดตั้งฝั่ง API

```powershell
cd C:\class\ENGSE203\engse203-student-labs-68543210050\labs\week-07\source\api
npm.cmd install
```

## ติดตั้งฝั่ง Frontend

```powershell
cd C:\class\ENGSE203\engse203-student-labs-68543210050\labs\week-07\source\frontend
npm.cmd install
```

---

# 13. วิธีเปิดระบบ

ระบบต้องเปิด API และ Frontend พร้อมกันโดยใช้ 2 Terminal

## Terminal 1: เปิด API

```powershell
cd C:\class\ENGSE203\engse203-student-labs-68543210050\labs\week-07\source\api
npm.cmd run dev
```

API ทำงานที่:

```text
http://localhost:3001
```

## Terminal 2: เปิด Frontend

```powershell
cd C:\class\ENGSE203\engse203-student-labs-68543210050\labs\week-07\source\frontend
npm.cmd run dev
```

Frontend ทำงานที่:

```text
http://localhost:5173
```

ต้องเปิด API ก่อนหรือเปิดพร้อม Frontend เพื่อให้ Dashboard โหลดข้อมูลได้

---

# 14. วิธีรัน Automated Test

Automated Test อยู่ที่:

```text
api/tests/api.test.js
```

รันด้วย:

```powershell
cd C:\class\ENGSE203\engse203-student-labs-68543210050\labs\week-07\source\api
npm.cmd test
```

ระบบทดสอบ API ด้วย `node:test`, `assert` และ `supertest` โดยไม่จำเป็นต้องเปิด API Server แยก

---

# 15. วิธีรัน Checker

## ตรวจเฉพาะงานในห้อง

```powershell
cd C:\class\ENGSE203\engse203-student-labs-68543210050\labs\week-07\source
node check-week07.mjs --inclass
```

ผลที่ต้องได้:

```text
25/25
```

## ตรวจทั้งหมด

```powershell
node check-week07.mjs
```

เป้าหมายงานหลัก:

```text
31/36
```

หากทำ Challenge ครบ สามารถได้สูงสุด:

```text
36/36
```

---

# 16. ข้อควรระวัง

ห้าม Commit ไฟล์ต่อไปนี้:

```text
node_modules/
.env
.env.local
```

ให้ Commit เฉพาะไฟล์ตัวอย่าง:

```text
api/.env.example
frontend/.env.example
```