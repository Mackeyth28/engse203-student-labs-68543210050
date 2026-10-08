import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { findUserByEmail } from './requestService.js';
import { verifyPassword } from '../utils/password.js';

/**
 * ตรวจอีเมลและรหัสผ่าน
 * ถูกต้อง → คืน { token, user }
 * ไม่ถูกต้อง → คืน null
 */
export function login(email, password) {
  const user = findUserByEmail(email);

  if (
    !user ||
    user.role !== 'staff' ||
    !verifyPassword(password, user.passwordHash)
  ) {
    return null;
  }

  const payload = {
    sub: String(user.id),
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(
    payload,
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  };
}

/**
 * ตรวจ token
 * ถูกต้อง → คืน payload
 * ปลอมหรือหมดอายุ → jwt.verify โยน error
 */
export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}