# API_TEST — LAB 06

**ชื่อ–รหัส:** Thapakorn Jaingam — 68543210050  
**วันที่ทดสอบ:** 13 กันยายน 2569

> บันทึก **ผลจริง** ที่เห็น ไม่ใช่ผลที่ควรได้ หากไม่ผ่านให้เขียนว่าไม่ผ่าน

| # | Method | Path | ส่งอะไร | status ที่ควรได้ | status ที่ได้จริง | ผ่าน |
|---|---|---|---|---|---|---|
| 1 | GET | `/` | — | 200 | 200 | ✅ |
| 2 | GET | `/api/requests` | — | 200 | 200 | ✅ |
| 3 | GET | `/api/requests/REQ-001` | — | 200 | 200 | ✅ |
| 4 | GET | `/api/requests/REQ-999` | — | 404 | 404 | ✅ |
| 5 | POST | `/api/requests` | ข้อมูลครบถูกต้อง | 201 | 201 | ✅ |
| 6 | POST | `/api/requests` | `{"requesterName":"x"}` | 400 | 400 | ✅ |
| 7 | DELETE | `/api/requests/REQ-003` | — | 204 | 204 | ✅ |
| 8 | DELETE | `/api/requests/REQ-999` | — | 404 | 404 | ✅ |
| 9 | GET | `/api/unknown` | — | 404 | 404 | ✅ |

## ⭐ Challenge (ถ้าทำ)

| # | Method | Path | status ที่ควรได้ | ที่ได้จริง | ผ่าน |
|---|---|---|---|---|---|
| 10 | GET | `/api/requests?status=pending` | 200 และแสดงเฉพาะสถานะ pending | 200 และกรองเฉพาะ pending | ✅ |
| 11 | PUT | `/api/requests/REQ-001` + `{"status":"in-progress"}` | 200 | ไม่ได้ทำ | ☐ |
| 12 | PUT | `/api/requests/REQ-001` + `{"status":"มั่ว"}` | 400 | ไม่ได้ทำ | ☐ |

## ทดสอบว่าข้อมูลอยู่ถาวร (CP08)

| ขั้น | ทำอะไร | ผลที่เห็น |
|---|---|