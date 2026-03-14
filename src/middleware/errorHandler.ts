import { Request, Response, NextFunction } from 'express';
import { UniqueConstraintViolationException, ValidationError } from '@mikro-orm/core';

export default function errorHandler(
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
)  {
  console.error(err);

  // MikroORM Unique Constraint
  if (err instanceof UniqueConstraintViolationException) {
    return res.status(400).json({
      success: false,
      message: 'Violación de restricción única en la base de datos.',
      errors: [err.message],
    });
  }

  // MikroORM Validation Error
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación de MikroORM',
      errors: [err.message],
    });
  }

  // Otros errores
  return res.status(400).json({
    success: false,
    message: err.message || 'Error desconocido',
    errors: [],
  });
}

module.exports = errorHandler;
