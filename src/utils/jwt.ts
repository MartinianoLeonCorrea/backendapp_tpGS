const jwt = require('jsonwebtoken');
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt';

export interface AuthTokenPayload {
  userId: number;
  email?: string;
  dni?: string;
  legajo?: string;
  iat?: number;
  exp?: number;
}

export function generateToken(payload: AuthTokenPayload): string {
  // Uso de secreto centralizado y tiempo de expiración desde la configuración
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthTokenPayload {
  // jwt.verify puede tirar errores; callers deberian manejar errores
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}
