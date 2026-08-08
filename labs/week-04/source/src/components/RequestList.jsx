import RequestCard from './RequestCard.jsx';

function RequestList({ requests, onDeleteRequest }) {
  // TODO LAB4-R11: เพิ่ม empty state เมื่อ requests.length === 0
  /*
   * LAB4-R11: Empty State แบบ Conditional Rendering
   *
   * เมื่อไม่มีคำร้องที่ตรงกับตัวกรอง จะไม่สร้าง RequestCard
   * แต่จะแสดงข้อความให้ผู้ใช้ทราบว่าไม่มีรายการ
   */
  if (requests.length === 0) {
    return (
      <div className="request-list">
        <p className="empty-state" role="status">
          ไม่พบคำร้องในสถานะที่เลือก
        </p>
      </div>
    );
  }

  /*
   * LAB4-R09: แสดงรายการคำร้องด้วย map()
   *
   * request.id ใช้เป็น key ที่มีความคงที่
   * request ส่งข้อมูลไปยัง RequestCard ผ่าน Props
   * onDeleteRequest ส่ง Callback สำหรับลบกลับไปยัง App
   */
  return (
    <div className="request-list">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}

export default RequestList;