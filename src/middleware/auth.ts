import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;

  // 1. Verificamos que el header exista
  if (!authorizationHeader) {
    return res.status(401).json({
      message: 'Acceso denegado: No se proporcionó un token de autorización.',
    });
  }
  // 2. Limpiamos el token quitando la palabra 'Bearer ' si existe
  const token = authorizationHeader.startsWith('Bearer ')
    ? authorizationHeader.slice(7)
    : authorizationHeader;

  // 3. Intentamos verificar el token
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    // 4. Manejo de errores específicos de JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        code: 'TOKEN_EXPIRED', // Añadimos un código para que el Frontend lo identifique fácilmente
      });
    }
    // Si no es por expiración, asumimos que es inválido o corrupto
    return res.status(401).json({
      message: 'El token proporcionado es inválido o ha sido alterado.',
      code: 'TOKEN_INVALID',
    });
  }
};
