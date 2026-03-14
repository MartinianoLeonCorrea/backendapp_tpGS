import { Request, Response, NextFunction } from 'express';

export function notFound(req: Request, res: Response, next: NextFunction) {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  (error as any).status = 404;
  next(error);
};
