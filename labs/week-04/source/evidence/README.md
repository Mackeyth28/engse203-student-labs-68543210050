# LAB 4 Evidence

เก็บภาพที่ไม่เปิดเผยข้อมูลส่วนบุคคลเกินจำเป็น เช่น:

- `desktop.png`
- `mobile-375.png`
- `validation.png`
- `empty-state.png`
- `pages-incognito.png`

เชื่อมชื่อไฟล์เหล่านี้ใน README หลักของ repository นักศึกษา

## Test Evidence

| Test ID | Actual Result | Pass/Fail | Evidence/Screenshot |
| --- | --- | --- | --- |
| TC-01 Initial | แสดงคำร้องเริ่มต้น 3 รายการและ Summary ถูกต้อง โดย Console ไม่มี Error | Pass | evidence/desktop.png |
| TC-02 Controlled input | ทุกช่องเปลี่ยนค่าตาม State และกรอกข้อมูลได้ตามปกติ | Pass | evidence/desktop.png |
| TC-03 Invalid submit | ระบบไม่เพิ่มคำร้องและแสดงข้อความ Error ใกล้ช่องที่กรอกไม่ถูกต้อง | Pass | evidence/validation.png |
| TC-04 Valid submit | เพิ่มคำร้องสถานะ pending สำเร็จ Summary เพิ่ม และฟอร์ม Reset | Pass | evidence/desktop.png |
| TC-05 Filter status | ตัวกรองแสดงเฉพาะคำร้องที่มีสถานะตรงกับค่าที่เลือก | Pass | evidence/desktop.png |
| TC-06 Return all | เมื่อเลือกทั้งหมด ระบบแสดงคำร้องครบทุกสถานะ | Pass | evidence/desktop.png |
| TC-07 Empty state | ระบบแสดงข้อความเมื่อไม่มีคำร้องที่ตรงกับตัวกรอง | Pass | evidence/empty-state.png |
| TC-08 Delete | ลบคำร้องตาม ID ถูกต้อง และ Summary กับรายการเปลี่ยนตาม State | Pass | evidence/desktop.png |
| TC-09 375px | หน้าเว็บแสดงได้ที่ความกว้าง 375px โดยไม่มี Horizontal Scroll | Pass | evidence/mobile-375.png |
| TC-10 Keyboard | ใช้ Tab เข้าถึงช่องกรอก ตัวกรอง และปุ่มได้ พร้อมเห็น Focus ชัดเจน | Pass | evidence/mobile-375.png |
| TC-11 Build/preview | npm run build และ npm run preview ทำงานสำเร็จ | Pass | บันทึกผลการทดสอบใน README |
| TC-12 Pages | รอตรวจหลังเผยแพร่ GitHub Pages | Pending | evidence/pages-incognito.png |

