# Campus Service Request

ระบบ Full-Stack สำหรับจัดการคำร้องบริการภายในมหาวิทยาลัย ผู้ใช้สามารถดู เพิ่ม เปลี่ยนสถานะ และลบคำร้องได้ โดยข้อมูลจัดเก็บในฐานข้อมูล SQLite

## ภาพรวมระบบ

ระบบประกอบด้วย React Frontend, Express REST API และฐานข้อมูล SQLite โดยใน Development จะแยก Frontend และ API คนละพอร์ต ส่วน Production จะ Build Frontend เป็น Static Files และให้ Express เสิร์ฟทั้งหน้าเว็บและ API ผ่านพอร์ตเดียวกัน

## เทคโนโลยีที่ใช้

- Frontend: React และ Vite
- Backend: Node.js และ Express
- Database: SQLite ผ่าน `node:sqlite`
- Logging: Morgan
- Testing: Node Test Runner และ Supertest
- Deployment: Render Web Service

## สถาปัตยกรรม 3 ชั้น

```text
┌──────────────┐       HTTP / JSON       ┌──────────────┐       SQL       ┌──────────────┐
│ React        │ ──────────────────────► │ Express API  │ ──────────────► │ SQLite       │
│ Frontend     │ ◄────────────────────── │ Backend      │ ◄────────────── │ Database     │
└──────────────┘                         └──────────────┘                 └──────────────┘
```

| ชั้น | หน้าที่ | โฟลเดอร์ |
|---|---|---|
| Frontend | แสดงผล รับข้อมูล และเรียก REST API | `frontend/` |
| API | จัดการ Route, Controller, Validation และ HTTP Status | `api/src/` |
| Database | จัดเก็บข้อมูลผู้ใช้และคำร้อง | `api/data/` |

## การไหลของข้อมูล

เมื่อผู้ใช้สร้างคำร้องใหม่:

1. ผู้ใช้กรอกแบบฟอร์มใน React
2. Frontend Service ส่ง `POST /api/requests`
3. Express Route ส่ง Request ไปยัง Controller
4. Controller ตรวจข้อมูลและเรียก Service
5. Service ค้นหาหรือสร้างผู้แจ้ง และแปลงชื่อเป็น `requester_id`
6. Service บันทึกคำร้องลง SQLite ภายใน Transaction
7. API คืนข้อมูลคำร้องใหม่เป็น JSON
8. React อัปเดต Dashboard

## วิธีรัน Development

### Terminal 1: API

```bash
cd api
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

API เปิดที่:

```text
http://localhost:3001
```

### Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend เปิดที่:

```text
http://localhost:5173
```

## วิธีรัน Production

จากโฟลเดอร์ `labs/week-11/source`:

```bash
npm install
```

Build ระบบ:

```bash
NODE_ENV=production npm run build
```

เปิดระบบผ่านพอร์ตเดียว:

```bash
NODE_ENV=production PORT=10000 npm start
```

สำหรับ Windows PowerShell:

```powershell
$env:NODE_ENV="production"
$env:PORT="10000"
npm.cmd start
```

เปิดระบบที่:

```text
http://localhost:10000
```

## Environment Variables

| ตัวแปร | ค่าเริ่มต้น | หน้าที่ |
|---|---|---|
| `NODE_ENV` | `development` | แยก Development และ Production |
| `PORT` | `3001` | พอร์ตของ Express |
| `CORS_ORIGIN` | `http://localhost:5173` | Origin ที่ได้รับอนุญาตให้เรียก API |
| `DB_FILE` | `api/data/campus.db` | ตำแหน่งไฟล์ SQLite |
| `STATIC_DIR` | `frontend/dist` | ตำแหน่ง Production Build |

ไฟล์ `.env` ใช้สำหรับค่าบนเครื่องและห้าม Commit ส่วน `.env.example` มีเฉพาะค่าตัวอย่างที่ไม่มีข้อมูลลับ

## Health Check

Endpoint:

```text
GET /api/health
```

Health Check ตรวจทั้ง API และฐานข้อมูล หากระบบพร้อมจะตอบ `200 OK` พร้อมข้อมูลลักษณะนี้:

```json
{
  "status": "ok",
  "env": "production",
  "database": {
    "connected": true,
    "driver": "sqlite"
  }
}
```

ถ้าฐานข้อมูลไม่พร้อม ระบบจะตอบ `503 Service Unavailable`

## การจัดการ Error และ Logging

- Route ที่ไม่มีอยู่ตอบ `404`
- ข้อมูลไม่ครบหรือผิดรูปแบบตอบ `400`
- Error ที่ไม่คาดคิดตอบ `500`
- Development ใช้ Morgan รูปแบบ `dev`
- Production ใช้ Morgan รูปแบบ `combined`
- Production ไม่ส่ง Stack Trace ให้ผู้ใช้

## การตัดสินใจออกแบบ

ระบบแยกเป็นสามชั้นเพื่อลดการผูกกันระหว่างหน้าจอ, Business Logic และฐานข้อมูล เมื่อแก้หน้าจอจะไม่ต้องแก้ SQL และเมื่อเปลี่ยนฐานข้อมูลจะเน้นแก้ที่ Service Layer

ระบบเลือก SQLite เพราะข้อมูลมีโครงสร้างชัดเจนและมีความสัมพันธ์ระหว่าง `users` กับ `requests` อีกทั้งต้องใช้ Primary Key, Foreign Key, UNIQUE และ CHECK Constraint ระบบขนาดเล็กสามารถใช้งาน SQLite ได้โดยไม่ต้องเปิด Database Server แยก

## Production Deployment

ระบบถูก Deploy บน Render:

- Dashboard: https://engse203-student-labs-68543210050.onrender.com/
- Health Check: https://engse203-student-labs-68543210050.onrender.com/api/health
- Requests API: https://engse203-student-labs-68543210050.onrender.com/api/requests

Render Free Instance อาจใช้เวลาเริ่มทำงานเมื่อไม่มีการใช้งาน และ SQLite แบบไฟล์อาจกลับเป็นข้อมูลจาก Repository เมื่อ Service Restart หรือ Redeploy