import { useState } from 'react';
import AppHeader from './components/AppHeader.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import RequestForm from './components/RequestForm.jsx';
import FilterBar from './components/FilterBar.jsx';
import RequestList from './components/RequestList.jsx';
import { initialRequests } from './data/initialRequests.js';

function App() {
  /*
   * LAB4-R04: เปลี่ยน requests และ statusFilter ให้เป็น State
   *
   * requests เก็บรายการคำร้องทั้งหมด
   * setRequests ใช้ปรับปรุงรายการเมื่อเพิ่มหรือลบคำร้อง
   *
   * statusFilter เก็บสถานะตัวกรองปัจจุบัน
   * ค่าเริ่มต้นเป็น all เพื่อให้แสดงคำร้องทุกสถานะ
   */
  const [requests, setRequests] = useState(initialRequests);
  const [statusFilter, setStatusFilter] = useState('all');

  /*
   * LAB4-R04: Summary เป็น Derived Data
   *
   * ไม่จำเป็นต้องสร้าง State เพิ่ม เพราะสามารถคำนวณใหม่
   * จาก requests ทุกครั้งที่รายการคำร้องเปลี่ยนแปลง
   */
  const summary = {
    total: requests.length,

    pending: requests.filter(
      (request) => request.status === 'pending'
    ).length,

    inProgress: requests.filter(
      (request) => request.status === 'in-progress'
    ).length,

    completed: requests.filter(
      (request) => request.status === 'completed'
    ).length,
  };

  /*
   * LAB4-R08: กรองรายการคำร้องตาม statusFilter
   *
   * ถ้าเลือก all ให้แสดง requests ทั้งหมด
   * ถ้าเลือกสถานะอื่น ให้แสดงเฉพาะรายการที่มีสถานะตรงกัน
   */
  const filteredRequests =
    statusFilter === 'all'
      ? requests
      : requests.filter(
          (request) => request.status === statusFilter
        );

  /*
   * LAB4-R07: เพิ่มคำร้องใหม่แบบ Immutable
   *
   * 1. อ่านหมายเลขจาก ID ของรายการเดิม
   * 2. หาหมายเลขที่มากที่สุดแล้วเพิ่มอีก 1
   * 3. สร้างคำร้องใหม่ด้วยสถานะ pending
   * 4. สร้าง Array ใหม่แทนการใช้ push()
   */
  function handleAddRequest(requestData) {
    const requestNumbers = requests.map((request) => {
      const number = Number(request.id.replace('REQ-', ''));

      return Number.isNaN(number) ? 0 : number;
    });

    const nextNumber = Math.max(0, ...requestNumbers) + 1;

    const newRequest = {
      ...requestData,
      id: `REQ-${String(nextNumber).padStart(3, '0')}`,
      status: 'pending',
    };

    setRequests((currentRequests) => [
      newRequest,
      ...currentRequests,
    ]);
  }

  /*
   * LAB4-R10: ลบคำร้องแบบ Immutable
   *
   * รับ requestId จาก RequestCard ผ่าน Callback
   * แล้วใช้ filter() สร้าง Array ใหม่ที่ไม่มีรายการดังกล่าว
   */
  function handleDeleteRequest(requestId) {
    setRequests((currentRequests) =>
      currentRequests.filter(
        (request) => request.id !== requestId
      )
    );
  }

  return (
    <>
      {/* ส่วนหัวของแอปพลิเคชัน */}
      <AppHeader
        title="Campus Service Request"
        subtitle="LAB 4 Starter เปลี่ยน DOM-driven UI เป็น State-driven React UI"
      />

      <main className="container page-content">
        {/*
         * ส่งข้อมูลสรุปลงไปให้ SummaryPanel ผ่าน summary prop
         */}
        <SummaryPanel summary={summary} />

        <div className="workspace-grid">
          {/*
           * RequestForm จะส่งข้อมูลฟอร์มกลับมาที่ App
           * ผ่าน onAddRequest callback
           */}
          <RequestForm onAddRequest={handleAddRequest} />

          <section
            className="panel"
            aria-labelledby="request-list-title"
          >
            <div className="section-heading">
              <h2 id="request-list-title">รายการคำร้อง</h2>

              {/*
               * value คือสถานะตัวกรองปัจจุบัน
               * เมื่อกดตัวกรอง FilterBar จะเรียก setStatusFilter
               */}
              <FilterBar
                value={statusFilter}
                onFilterChange={setStatusFilter}
              />
            </div>

            {/*
             * ส่งเฉพาะรายการที่ผ่านการกรองไปแสดง
             * พร้อม Callback สำหรับลบคำร้อง
             */}
            <RequestList
              requests={filteredRequests}
              onDeleteRequest={handleDeleteRequest}
            />
          </section>
        </div>
      </main>
    </>
  );
}

export default App;