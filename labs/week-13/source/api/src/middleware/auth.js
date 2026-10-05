import { verifyToken } from '../services/authService.js';

/**
 * ตรวจว่า request มี JWT ที่ถูกต้องหรือไม่
 *
 * ไม่มี token / token ปลอม / token หมดอายุ → 401
 * token ถูกต้อง → แนบ payload ไว้ที่ req.user
 */
export function authenticate(req, res, next) {
  const header = req.get('Authorization') ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.set('WWW-Authenticate', 'Bearer');

    return res.status(401).json({
      error: 'ต้องเข้าสู่ระบบก่อน',
    });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({
      error: 'token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่',
    });
  }
}

/**
 * ตรวจสิทธิ์ตาม role
 *
 * เข้าสู่ระบบแล้ว แต่ role ไม่ตรง → 403
 */
export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({
        error: 'ไม่มีสิทธิ์ทำรายการนี้',
      });
    }

    return next();
  };
}