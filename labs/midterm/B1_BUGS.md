# B1 · บันทึกการแก้บั๊ก (กรอกให้ครบทั้ง 6 จุด)

> แต่ละบั๊กให้เขียน 4 อย่าง: ไฟล์ · บรรทัด · สาเหตุ (ทำไมทำงานผิด) · แก้อย่างไร
> เขียนด้วยคำของตัวเอง — จุดนี้จะถูกถามใน oral

## บั๊กที่ 1 — อาการ: Console เตือนสีเหลืองเรื่องรายการ
- ไฟล์/บรรทัด:`src/components/RequestList.jsx`
บรรทัดที่สร้าง `<RequestCard />` ภายใน `requests.map()`

- สาเหตุ:`RequestCard` แต่ละรายการไม่มี `key` ที่ไม่ซ้ำกัน ทำให้ React ไม่สามารถระบุและติดตามรายการแต่ละตัวได้อย่างถูกต้อง

- แก้อย่างไร:เพิ่ม `key={request.id}` ให้กับ `<RequestCard />` โดยใช้ ID ของคำร้องเป็น Stable Key

## บั๊กที่ 2 — อาการ: ตัวเลข "รอดำเนินการ" ในแผงสรุปไม่ตรงกับที่เห็น
- ไฟล์/บรรทัด:`src/pages/DashboardPage.jsx` บรรทัดประมาณ 47 ในการคำนวณ `summary.pending`

- สาเหตุ:ตัวแปร `pending` ใช้เงื่อนไขตรวจสอบ `request.status === 'completed'` ทำให้ระบบนำจำนวนคำร้องที่เสร็จสิ้นมาแสดงเป็นจำนวนคำร้องรอดำเนินการ

- แก้อย่างไร:เปลี่ยนค่าที่ใช้เปรียบเทียบจาก `'completed'` เป็น `'pending'` เพื่อให้นับเฉพาะคำร้องที่มีสถานะรอดำเนินการ

## บั๊กที่ 3 — อาการ: กดตัวกรอง "รอดำเนินการ" แล้วได้รายการที่ไม่ใช่
- ไฟล์/บรรทัด:src/pages/DashboardPage.jsx` บริเวณบรรทัด 52–55 ที่คำนวณ `filteredRequests`

- สาเหตุ:เงื่อนไขเดิมใน `requests.filter()` ใช้ `request.status !== statusFilter` ทำให้ระบบเลือกคำร้องที่มีสถานะไม่ตรงกับตัวกรอง

- แก้อย่างไร:เปลี่ยนตัวดำเนินการจาก `!==` เป็น `===` เพื่อให้เลือกเฉพาะคำร้องที่มีสถานะตรงกับ `statusFilter`  

## บั๊กที่ 4 — อาการ: เปลี่ยน URL จาก REQ-001 เป็น REQ-002 แล้วข้อมูลไม่เปลี่ยน
- ไฟล์/บรรทัด:ไฟล์/บรรทัด: `src/pages/RequestDetailPage.jsx` บริเวณ `useEffect()` และ Dependency Array

- สาเหตุ:`useEffect()` กำหนด Dependency Array เป็น `[reloadKey]` โดยไม่มี `requestId` เมื่อเปลี่ยน Request ID ใน URL จึงไม่เรียก `getRequestById()` ใหม่ และยังแสดงข้อมูลของคำร้องเดิม

- แก้อย่างไร:เพิ่ม `requestId` เข้า Dependency Array เป็น `[requestId, reloadKey]` พร้อมล้างข้อมูลเดิมก่อนเริ่มโหลดข้อมูลคำร้องใหม่

## บั๊กที่ 5 — อาการ: กด "ลบ" แล้วรายการยังอยู่ ต้องรีเฟรชถึงหาย
- ไฟล์/บรรทัด:`src/pages/DashboardPage.jsx` ภายในฟังก์ชัน `handleDelete`

- สาเหตุ:หลังจาก `deleteRequest(requestId)` ส่งรายการล่าสุดกลับมาเก็บไว้ใน `nextRequests` โค้ดกลับเรียก `setRequests(requests)` ซึ่งเป็นข้อมูลชุดเดิม ทำให้ State บนหน้า Dashboard ไม่เปลี่ยนและ React ไม่ Render รายการใหม่

- แก้อย่างไร:เปลี่ยนจาก `setRequests(requests)` เป็น `setRequests(nextRequests)` เพื่ออัปเดต State ด้วยรายการล่าสุดที่ไม่มีคำร้องที่ถูกลบแล้ว

## บั๊กที่ 6 — อาการ: กด "Reset Demo Data" แล้วหน้าพัง/ว่างเปล่า
- ไฟล์/บรรทัด: `src/pages/DashboardPage.jsx` ภายในฟังก์ชัน `handleReset`

- สาเหตุ:โค้ดเรียก `setRequests(resetRequests())` โดยไม่ได้รอผลลัพธ์จากฟังก์ชัน `resetRequests()` ซึ่งเป็นฟังก์ชันแบบ asynchronous ทำให้ค่าที่นำไปเก็บใน State อาจเป็น Promise แทน Array ของคำร้อง

- แก้อย่างไร:ใช้ `await resetRequests()` เพื่อรอรายการคำร้องที่คืนค่าเสร็จแล้ว เก็บผลลัพธ์ไว้ใน `nextRequests` จากนั้นเรียก `setRequests(nextRequests)`
