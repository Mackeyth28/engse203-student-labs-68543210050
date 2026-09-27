# ผลการทดสอบ SQL Injection

## วิธีป้องกัน

ระบบใช้ Parameterized Query โดยส่งค่าจากผู้ใช้ผ่าน Placeholder `?`

```js
db.prepare(`
  ${baseQuery}
  WHERE r.status = ?
  ORDER BY r.id
`).all(status);