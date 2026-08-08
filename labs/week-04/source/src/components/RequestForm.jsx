import { useState } from 'react';

/*
 * ค่าเริ่มต้นของฟอร์ม
 *
 * แยกออกมาเป็นค่าคงที่ เพื่อให้สามารถนำกลับมาใช้
 * สำหรับ reset ฟอร์มหลังเพิ่มคำร้องสำเร็จได้
 */
const initialFormData = {
  requesterName: '',
  requestType: '',
  location: '',
  details: '',
  priority: 'normal',
};

function RequestForm({ onAddRequest }) {
  /*
   * LAB4-R05: Controlled Form
   *
   * formData เก็บค่าของทุกช่องในฟอร์ม
   * ค่าที่แสดงใน input จะอ้างอิงจาก State นี้เสมอ
   */
  const [formData, setFormData] = useState(initialFormData);

  /*
   * errors เก็บข้อความ validation ของแต่ละช่อง
   *
   * ถ้าช่องใดไม่มีข้อผิดพลาด ค่าของช่องนั้นจะไม่มีอยู่
   * หรือมีค่าเป็นข้อความว่าง
   */
  const [errors, setErrors] = useState({});

  /*
   * feedback ใช้แจ้งผลการเพิ่มคำร้อง
   *
   * ข้อความจะแสดงผ่าน element ที่มี role="status"
   * เพื่อให้เทคโนโลยีช่วยเหลือสามารถแจ้งผู้ใช้ได้
   */
  const [feedback, setFeedback] = useState('');

  /*
   * LAB4-R05: อัปเดต Controlled Form
   *
   * ใช้ name ของ input เป็น key และใช้ value เป็นค่าใหม่
   * สร้าง Object ใหม่ด้วย spread operator เพื่อไม่แก้ State เดิมโดยตรง
   */
 function handleChange(event) {
  const { name, value } = event.target;

  // ใช้ชื่อช่องเป็น key เช่น requesterName, location หรือ details
  setFormData((currentFormData) => ({
    ...currentFormData,
    [name]: value,
  }));

  // ล้าง Error เฉพาะช่องที่ผู้ใช้กำลังแก้
  setErrors((currentErrors) => ({
    ...currentErrors,
    [name]: '',
  }));

  setFeedback('');
}

  /*
   * LAB4-R06: ตรวจสอบข้อมูลในฟอร์ม
   *
   * requesterName ต้องมีอย่างน้อย 2 ตัวอักษรหลัง trim
   * requestType ต้องเลือกประเภท
   * location ต้องไม่เป็นค่าว่างหลัง trim
   * details ต้องมีอย่างน้อย 10 ตัวอักษรหลัง trim
   * priority ต้องเป็น normal หรือ urgent
   */
  function validateForm() {
    const nextErrors = {};

    if (formData.requesterName.trim().length < 2) {
      nextErrors.requesterName =
        'กรุณากรอกชื่อผู้แจ้งอย่างน้อย 2 ตัวอักษร';
    }

    if (!formData.requestType) {
      nextErrors.requestType = 'กรุณาเลือกประเภทคำร้อง';
    }

    if (!formData.location.trim()) {
      nextErrors.location = 'กรุณากรอกสถานที่';
    }

    if (formData.details.trim().length < 10) {
      nextErrors.details =
        'กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร';
    }

    if (!['normal', 'urgent'].includes(formData.priority)) {
      nextErrors.priority = 'กรุณาเลือกความเร่งด่วน';
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    /*
     * TODO LAB4-R05–R07: validate controlled state แล้วเรียก onAddRequest
     *
     * LAB4-R06: ถ้ามี validation error จะไม่เพิ่มคำร้อง
     * และแสดงข้อความใกล้กับช่องที่มีปัญหา
     */
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFeedback('กรุณาตรวจสอบข้อมูลที่กรอก');
      return;
    }

    /*
     * LAB4-R07: ส่งข้อมูลกลับไปยัง App ผ่าน Callback
     *
     * trim ข้อความก่อนส่งข้อมูล
     * ส่วน id และ status จะถูกสร้างใน App
     */
    onAddRequest({
      requesterName: formData.requesterName.trim(),
      requestType: formData.requestType,
      location: formData.location.trim(),
      details: formData.details.trim(),
      priority: formData.priority,
    });

    /*
     * Reset ฟอร์มและ error หลังเพิ่มคำร้องสำเร็จ
     */
    setFormData(initialFormData);
    setErrors({});
    setFeedback('เพิ่มคำร้องสำเร็จ');
  }

  return (
    <section className="panel" aria-labelledby="request-form-title">
      <p className="eyebrow dark">CONTROLLED FORM</p>
      <h2 id="request-form-title">สร้างคำร้องใหม่</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="requesterName">ชื่อผู้แจ้ง</label>

          <input
            id="requesterName"
            name="requesterName"
            type="text"
            value={formData.requesterName}
            onChange={handleChange}
            aria-invalid={Boolean(errors.requesterName)}
            aria-describedby={
              errors.requesterName
                ? 'requesterName-error'
                : undefined
            }
          />

          <small
            className="error"
            id="requesterName-error"
          >
            {errors.requesterName}
          </small>
        </div>

        <div className="field">
          <label htmlFor="requestType">ประเภทคำร้อง</label>

          <select
            id="requestType"
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            aria-invalid={Boolean(errors.requestType)}
            aria-describedby={
              errors.requestType
                ? 'requestType-error'
                : undefined
            }
          >
            <option value="">-- เลือกประเภท --</option>
            <option value="แจ้งซ่อม">แจ้งซ่อม</option>
            <option value="ขอใช้ห้อง">ขอใช้ห้อง</option>
            <option value="บริการบัญชีผู้ใช้">
              บริการบัญชีผู้ใช้
            </option>
          </select>

          <small
            className="error"
            id="requestType-error"
          >
            {errors.requestType}
          </small>
        </div>

        <div className="field">
          <label htmlFor="location">สถานที่</label>

          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            aria-invalid={Boolean(errors.location)}
            aria-describedby={
              errors.location
                ? 'location-error'
                : undefined
            }
          />

          <small
            className="error"
            id="location-error"
          >
            {errors.location}
          </small>
        </div>

        <div className="field">
          <label htmlFor="details">รายละเอียด</label>

          <textarea
            id="details"
            name="details"
            rows="4"
            value={formData.details}
            onChange={handleChange}
            aria-invalid={Boolean(errors.details)}
            aria-describedby={
              errors.details ? 'details-error' : undefined
            }
          />

          <small
            className="error"
            id="details-error"
          >
            {errors.details}
          </small>
        </div>

        <fieldset
          className="field"
          aria-invalid={Boolean(errors.priority)}
          aria-describedby={
            errors.priority ? 'priority-error' : undefined
          }
        >
          <legend>ความเร่งด่วน</legend>

          <label>
            <input
              type="radio"
              name="priority"
              value="normal"
              checked={formData.priority === 'normal'}
              onChange={handleChange}
            />
            {' '}ปกติ
          </label>

          <label>
            <input
              type="radio"
              name="priority"
              value="urgent"
              checked={formData.priority === 'urgent'}
              onChange={handleChange}
            />
            {' '}เร่งด่วน
          </label>

          <small
            className="error"
            id="priority-error"
          >
            {errors.priority}
          </small>
        </fieldset>

        <button type="submit">เพิ่มคำร้อง</button>

        {/*
         * LAB4-R11: Conditional feedback
         *
         * แสดงข้อความเมื่อมี feedback เท่านั้น
         * role="status" ช่วยให้ข้อความถูกประกาศโดย Screen Reader
         */}
        {feedback && (
          <p className="status" role="status">
            {feedback}
          </p>
        )}
      </form>
    </section>
  );
}

export default RequestForm;