import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

/**
 * Middleware para validar el cuerpo de la petición (o params/query) contra un esquema de Joi.
 * @param schema Esquema de validación de Joi
 * @param property Propiedad del request a validar ('body', 'query', 'params')
 */
export const validateRequest = (schema: Schema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Validamos la propiedad específica (por defecto 'body') contra el esquema
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const formattedErrors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      console.log('Errores de validación recibidos:', formattedErrors);

      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: formattedErrors,
      });
    }

    next();
  };
};