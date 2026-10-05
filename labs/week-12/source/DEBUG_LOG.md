# บันทึกการไล่ปัญหา (Debug Log)

🏫 **TODO W12-LOG (CP45 · CP47)** — แต่ละ bug ตอบ 6 ข้อ · เขียนสั้น ๆ แต่ต้องชัด

> BUG #0 ไม่มีผู้ใช้แจ้ง — คุณจะเจอเองตอนเขียน unit test ค่าขอบใน CP45
> BUG #1–#3 มาจาก `BUG_REPORTS.md`

---

## BUG #0 · รายละเอียด 10 ตัวอักษรพอดีไม่ผ่านการตรวจสอบ

- **อาการ:** รายละเอียดที่มีความยาว 10 ตัวอักษรพอดีถูกแจ้งว่า “รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร” ทั้งที่ควรผ่านตามกฎ
- **วิธีทำซ้ำ:** เรียก `validateRequestInput()` โดยกำหนด `details` เป็น `1234567890` แล้วตรวจผลลัพธ์ พบว่าได้รับ error แทนที่จะเป็น array ว่าง
- **เครื่องมือ:** Vitest unit test และ Boundary Value Analysis โดยทดสอบรายละเอียดความยาว 9, 10 และ 11 ตัวอักษร
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/validators/requestValidator.js:37` ใช้เงื่อนไข `length <= MIN_DETAILS` ทำให้ค่าที่เท่ากับ 10 ถูกปฏิเสธด้วย
- **วิธีแก้:** เปลี่ยนเงื่อนไขจาก `length <= MIN_DETAILS` เป็น `length < MIN_DETAILS`
- **test ที่กัน:** `api/tests/unit/requestValidator.test.js` ชื่อ test `10 ตัวอักษร → ผ่าน (ตรงขอบพอดี)` พร้อม test 9 และ 11 ตัวอักษรเพื่อยืนยันค่าขอบ


## BUG #1 · ลบคำร้องแล้วเพิ่มใหม่ ได้ 500

- **อาการ:** เมื่อลบคำร้อง `REQ-002` แล้วเพิ่มคำร้องใหม่ ระบบตอบ 500 พร้อมข้อความ `UNIQUE constraint failed: requests.id`
- **วิธีทำซ้ำ:** ส่ง `DELETE /api/requests/REQ-002` แล้วส่ง `POST /api/requests` ด้วยข้อมูลที่ถูกต้อง
- **เครื่องมือ:** curl, stack trace และ Vitest integration test
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/services/requestService.js` ฟังก์ชัน `nextId()` ใช้จำนวนรายการ `COUNT(*) + 1` คำนวณ ID หลังลบรายการกลางจึงได้ `REQ-005` ซึ่งซ้ำกับ ID ที่มีอยู่
- **วิธีแก้:** เปลี่ยน `nextId()` ให้หาเลขสูงสุดจาก ID ที่มีอยู่ แล้วบวก 1 จึงได้ `REQ-006`
- **test ที่กัน:** `api/tests/integration/requests.api.test.js` ชื่อ test `ลบรายการกลางแล้วเพิ่มใหม่ → 201 และ ID ไม่ซ้ำ`

## BUG #2 · Dashboard แสดง "กำลังดำเนินการ 0"

- **อาการ:** Dashboard แสดงจำนวนคำร้องสถานะ “กำลังดำเนินการ” เป็น 0 ทั้งที่มีคำร้อง `REQ-002` สถานะ `in-progress`
- **วิธีทำซ้ำ:** เปิด Dashboard แล้วตรวจการ์ด “กำลังดำเนินการ” จากนั้นตรวจข้อมูลคำร้องที่ได้รับจาก API
- **เครื่องมือ:** Browser DevTools, Network และ Vitest frontend test
- **สาเหตุ (ไฟล์:บรรทัด):** `frontend/src/utils/requestSummary.js` นับสถานะด้วยข้อความ `in progress` แต่ API ส่งสถานะเป็น `in-progress`
- **วิธีแก้:** เปลี่ยนค่าที่ใช้ในการนับจาก `count('in progress')` เป็น `count('in-progress')`
- **test ที่กัน:** `frontend/src/utils/requestSummary.test.js` ชื่อ test `สถานะ in-progress → นับกำลังดำเนินการ 1`

## BUG #3 · เปลี่ยนสถานะคำร้องที่ไม่มีอยู่ ได้ 500

- **อาการ:** เมื่อเปลี่ยนสถานะคำร้องรหัสที่ไม่มีอยู่ เช่น `REQ-999` ระบบตอบ 500 แทนที่จะตอบ 404
- **วิธีทำซ้ำ:** ส่งคำขอ `PUT /api/requests/REQ-999` พร้อมข้อมูล `{"status":"completed"}` แล้วพบว่า API ตอบ 500
- **เครื่องมือ:** curl, stack trace และ Vitest integration test
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/controllers/requestController.js:30` อ่าน `updated.id` และ `updated.status` ก่อนตรวจว่า `service.updateStatus()` คืนค่า `null`
- **วิธีแก้:** ย้ายเงื่อนไข `if (!updated)` มาไว้ก่อนบรรทัด `console.log` ที่อ่าน `updated.id` และ `updated.status`
- **test ที่กัน:** `api/tests/integration/requests.api.test.js` ชื่อ test `เปลี่ยนสถานะคำร้องที่ไม่มีอยู่ → 404`