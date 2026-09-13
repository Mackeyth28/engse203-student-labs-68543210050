import { readFile, writeFile } from 'node:fs/promises';

const SEED_PATH = new URL(
  '../../data/initialRequests.json',
  import.meta.url
);

/*
 * CP08: ไฟล์เก็บข้อมูลจริงระหว่างใช้งาน
 *
 * ข้อมูลที่เพิ่มหรือลบจะถูกเขียนลง requests.json
 * ทำให้ข้อมูลไม่หายหลังปิดและเปิดเซิร์ฟเวอร์ใหม่
 */
const DATA_PATH = new URL(
  '../../data/requests.json',
  import.meta.url
);

/** ข้อมูลอยู่ในหน่วยความจำของเซิร์ฟเวอร์ */
let requests = [];

/**
 * CP08: บันทึกข้อมูลปัจจุบันลงไฟล์ requests.json
 */
async function persist() {
  await writeFile(
    DATA_PATH,
    JSON.stringify(requests, null, 2),
    'utf8'
  );
}

/**
 * CP08: โหลดข้อมูลตอนเซิร์ฟเวอร์เริ่มทำงาน
 *
 * 1. ลองอ่านข้อมูลล่าสุดจาก requests.json ก่อน
 * 2. ถ้ายังไม่มีไฟล์ จึงโหลด initialRequests.json
 * 3. สร้าง requests.json ขึ้นมาเป็นข้อมูล Runtime
 */
export async function loadSeed() {
  try {
    const raw = await readFile(DATA_PATH, 'utf8');
    requests = JSON.parse(raw);
  } catch {
    const raw = await readFile(SEED_PATH, 'utf8');
    requests = JSON.parse(raw);

    await persist();
  }

  return structuredClone(requests);
}

/**
 * TODO W06-S1 (CP02) · คืนรายการคำร้องทั้งหมด
 * - คืนสำเนาด้วย structuredClone() เพื่อไม่ให้ข้างนอกแก้ข้อมูลต้นฉบับ
 * TODO W06-S1b (⭐ Challenge) · ถ้ามี options.status ให้กรองเฉพาะสถานะนั้น
 */
export function findAll({ status } = {}) {
  if (!status) {
    return structuredClone(requests);
  }

  return structuredClone(
    requests.filter((request) => request.status === status)
  );
}

/**
 * TODO W06-S2 (CP02) · คืนคำร้องใบเดียวตามรหัส
 * - ถ้าไม่พบให้คืน null
 * - Controller จะเป็นผู้ตัดสินใจตอบ 404
 */
export function findById(id) {
  const found = requests.find(
    (request) => request.id === id
  );

  return found ? structuredClone(found) : null;
}

/** สร้างรหัสไม่ซ้ำ ให้มาแล้ว ไม่ต้องแก้ */
function createId() {
  let id;

  do {
    const time = Date.now()
      .toString(36)
      .toUpperCase();

    const rand = Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase();

    id = `REQ-${time}-${rand}`;
  } while (
    requests.some((request) => request.id === id)
  );

  return id;
}

/**
 * TODO W06-S3 (CP04) · เพิ่มคำร้องใหม่
 *
 * CP08:
 * - เปลี่ยนเป็น async
 * - เรียก persist() หลังข้อมูลเปลี่ยน
 */
export async function create(input) {
  const newRequest = {
    id: createId(),
    requesterName: input.requesterName.trim(),
    requestType: input.requestType,
    location: input.location.trim(),
    details: input.details.trim(),
    priority: input.priority,
    status: 'pending',
  };

  requests.push(newRequest);

  // CP08: เขียนข้อมูลล่าสุดลง requests.json
  await persist();

  return structuredClone(newRequest);
}

/**
 * TODO W06-S4 (⭐ Challenge) · เปลี่ยนสถานะคำร้อง
 *
 * ยังไม่ต้องแก้ เพราะเป็น Challenge
 */
export function updateStatus(id, status) {
  throw new Error('TODO W06-S4: updateStatus');
}

/**
 * TODO W06-S5 (CP05) · ลบคำร้องตามรหัส
 * - คืน true ถ้าลบได้จริง
 * - คืน false ถ้าไม่พบรหัสนั้น
 * - ใช้ filter() สร้าง Array ใหม่
 *
 * CP08:
 * - เปลี่ยนเป็น async
 * - บันทึกไฟล์เมื่อลบสำเร็จ
 */
export async function remove(id) {
  const before = requests.length;

  requests = requests.filter(
    (request) => request.id !== id
  );

  const removed = requests.length < before;

  if (removed) {
    // CP08: เขียนรายการล่าสุดหลังลบลงไฟล์
    await persist();
  }

  return removed;
}