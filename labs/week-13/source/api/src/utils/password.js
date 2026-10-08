/**
 * password.js — เก็บรหัสผ่านอย่างปลอดภัยด้วย scrypt
 *
 * รูปแบบที่จัดเก็บ:
 * scrypt$<salt>$<hash>
 */

import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(plain) {
  const salt = randomBytes(16).toString('hex');

  const hash = scryptSync(
    plain,
    salt,
    KEY_LENGTH
  ).toString('hex');

  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(plain, stored) {
  try {
    if (
      typeof plain !== 'string' ||
      typeof stored !== 'string'
    ) {
      return false;
    }

    const parts = stored.split('$');

    if (parts.length !== 3) {
      return false;
    }

    const [scheme, salt, storedHashHex] = parts;

    if (
      scheme !== 'scrypt' ||
      !salt ||
      !storedHashHex ||
      !/^[0-9a-f]+$/i.test(storedHashHex) ||
      storedHashHex.length % 2 !== 0
    ) {
      return false;
    }

    const storedHash = Buffer.from(storedHashHex, 'hex');

    if (storedHash.length === 0) {
      return false;
    }

    const calculatedHash = scryptSync(
      plain,
      salt,
      storedHash.length
    );

    if (calculatedHash.length !== storedHash.length) {
      return false;
    }

    return timingSafeEqual(calculatedHash, storedHash);
  } catch {
    return false;
  }
}