# AI Usage Log — สอบกลางภาค

ชื่อ-รหัส: [ฐาปกรณ์ ใจงาม 68543210050-9]

บันทึกทุกครั้งที่ใช้ AI ระหว่างสอบ

| เวลา | งาน (B1/B2/B3/B4) | ถาม AI ว่าอะไร | ใช้คำตอบส่วนไหน | แก้เอง/ตรวจสอบอย่างไร |
|---|---|---|---|---|
| 11:35 | B1-Bug1 | ถามสาเหตุที่ Console แจ้งว่า Each child in a list should have a unique key prop | ใช้คำแนะนำให้เพิ่ม `key={request.id}` ที่ `<RequestCard />` ภายใน `requests.map()` | ตรวจว่าแต่ละ request มี ID ไม่ซ้ำกัน บันทึกไฟล์ รีเฟรชหน้าเว็บ และตรวจสอบว่า Warning ใน Console หายไป |
| 11:45 | B1-Bug2 | ถามสาเหตุที่ตัวเลขรอดำเนินการในแผงสรุปไม่ตรงกับรายการจริง | ใช้คำแนะนำให้ตรวจการคำนวณ `summary.pending` ใน `src/pages/DashboardPage.jsx` และเปลี่ยนเงื่อนไขเป็น `request.status === 'pending'` | เปรียบเทียบจำนวนในแผงสรุปกับข้อมูลคำร้องทั้ง 3 รายการ และตรวจว่ารอดำเนินการแสดงเป็น 1 รายการ |
| 11:55 | B1-Bug3 | ถามสาเหตุที่กดตัวกรองรอดำเนินการแล้วแสดงคำร้องสถานะอื่น | ใช้คำแนะนำให้ตรวจ `filteredRequests` ใน `src/pages/DashboardPage.jsx` และเปลี่ยนเงื่อนไขจาก `request.status !== statusFilter` เป็น `request.status === statusFilter` | ทดลองกดตัวกรองทั้งหมด รอดำเนินการ กำลังดำเนินการ และเสร็จสิ้น แล้วตรวจว่ารายการที่แสดงตรงกับสถานะที่เลือก |
| 12:15 | B1-Bug4 | ถามสาเหตุที่เปลี่ยน URL จาก REQ-001 เป็น REQ-002 แต่ข้อมูลรายละเอียดไม่เปลี่ยน | ใช้คำแนะนำให้ตรวจ Dependency Array ของ `useEffect()` ใน `RequestDetailPage.jsx` และเพิ่ม `requestId` | แก้ Dependency Array จาก `[reloadKey]` เป็น `[requestId, reloadKey]` แล้วทดลองเปิด REQ-001, REQ-002 และ REQ-003 เพื่อตรวจว่าข้อมูลตรงกับ URL |
| 12:20 | B1-Bug5 | ถามสาเหตุที่กดปุ่มลบแล้วคำร้องยังแสดงอยู่จนกว่าจะรีเฟรชหน้าเว็บ | ใช้คำแนะนำให้ตรวจฟังก์ชัน `handleDelete` ใน `src/pages/DashboardPage.jsx` และนำค่าล่าสุดจาก `deleteRequest(requestId)` มาอัปเดต State | เปลี่ยนจาก `setRequests(requests)` เป็น `setRequests(nextRequests)` แล้วทดลองลบคำร้อง เพื่อตรวจว่ารายการและ Dashboard อัปเดตทันทีโดยไม่ต้องรีเฟรช |
| 12:45 | B1-Bug6 | เพราะเหตุใดเมื่อกด Reset Demo Data แล้วข้อมูลตัวอย่างจึงไม่กลับมาอย่างถูกต้อง | คำแนะนำจาก AI: ตรวจสอบฟังก์ชัน `handleReset` ในไฟล์ `src/pages/DashboardPage.jsx` พบว่าโค้ดนำผลจาก `resetRequests()` ไปใส่ State โดยตรง ทั้งที่ฟังก์ชันดังกล่าวทำงานแบบ asynchronous จึงต้องรอผลลัพธ์ก่อน