import { describe, test, expect } from 'vitest';
import {
  validateRequestInput,
  isValidStatus,
} from '../../src/validators/requestValidator.js';

/**
 * Unit test — ทดสอบ pure function โดยตรง ไม่ต้องเปิด server ไม่ต้องมีฐานข้อมูล
 * กรณีทดสอบมาจากตาราง TEST_CASES.md (CP44)
 *
 * รัน:  npm test --prefix api
 */

// ข้อมูลที่ถูกต้องทุกช่อง
// แต่ละ test เปลี่ยนทีละช่องเพื่อให้รู้ว่าพังเพราะอะไร
const valid = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'ห้อง 301',
  details: 'แอร์ไม่เย็นตั้งแต่เช้า',
  priority: 'normal',
};

const withField = (patch) => ({ ...valid, ...patch });

describe('validateRequestInput — ข้อมูลถูกต้อง', () => {
  test('ทุกช่องถูกต้อง → ไม่มี error', () => {
    expect(validateRequestInput(valid)).toEqual([]);
  });
});

describe('validateRequestInput — รายละเอียด (ค่าขอบ 10 ตัวอักษร)', () => {
  test('9 ตัวอักษร → error (ต่ำกว่าขอบ 1)', () => {
    expect(
      validateRequestInput(withField({ details: '123456789' }))
    ).toEqual(['รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร']);
  });

  test('10 ตัวอักษร → ผ่าน (ตรงขอบพอดี)', () => {
    expect(
      validateRequestInput(withField({ details: '1234567890' }))
    ).toEqual([]);
  });

  test('11 ตัวอักษร → ผ่าน (มากกว่าขอบ 1)', () => {
    expect(
      validateRequestInput(withField({ details: '12345678901' }))
    ).toEqual([]);
  });

  test('รายละเอียดเป็นช่องว่างล้วน → error', () => {
    expect(
      validateRequestInput(withField({ details: '           ' }))
    ).toEqual(['รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร']);
  });
});

describe('validateRequestInput — ชื่อผู้แจ้ง', () => {
  test('ชื่อ 1 ตัวอักษร → error', () => {
    expect(
      validateRequestInput(withField({ requesterName: 'ก' }))
    ).toEqual(['ชื่อผู้แจ้งต้องมีอย่างน้อย 2 ตัวอักษร']);
  });

  test('ชื่อ 2 ตัวอักษร → ผ่าน', () => {
    expect(
      validateRequestInput(withField({ requesterName: 'กข' }))
    ).toEqual([]);
  });
});

describe('validateRequestInput — ประเภทและความเร่งด่วน', () => {
  test('ประเภทคำร้องนอกรายการ → error', () => {
    expect(
      validateRequestInput(withField({ requestType: 'ร้องเรียน' }))
    ).toEqual(['ประเภทคำร้องไม่ถูกต้อง']);
  });

  test('priority เป็น high → error', () => {
    expect(
      validateRequestInput(withField({ priority: 'high' }))
    ).toEqual(['ความเร่งด่วนต้องเป็น normal หรือ urgent']);
  });

  test('สถานที่เป็นช่องว่างล้วน → error', () => {
    expect(
      validateRequestInput(withField({ location: '   ' }))
    ).toEqual(['กรุณาระบุสถานที่']);
  });
});

describe('validateRequestInput — input ผิดรูปแบบ', () => {
  test.each([null, undefined, 'text', 42, []])(
    'input = %j → error เดียว',
    (input) => {
      expect(validateRequestInput(input)).toEqual([
        'ต้องส่งข้อมูลคำร้องมาด้วย',
      ]);
    }
  );

  test('input เป็น object ว่าง → error ครบทุกช่อง', () => {
    expect(validateRequestInput({})).toHaveLength(5);
  });
});

describe('isValidStatus', () => {
  test('"pending" → true', () => {
    expect(isValidStatus('pending')).toBe(true);
  });

  test('"in-progress" → true', () => {
    expect(isValidStatus('in-progress')).toBe(true);
  });

  test('"completed" → true', () => {
    expect(isValidStatus('completed')).toBe(true);
  });

  test('"done" → false', () => {
    expect(isValidStatus('done')).toBe(false);
  });
});