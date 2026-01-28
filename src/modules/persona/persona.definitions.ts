// src/modules/persona/persona.definitions.ts
export const DNI = {
  min: 1000000,
  max: 99999999,
  minLength: 7,
  maxLength: 8,
} as const;

export const NOMBRE = { min: 2, max: 50 } as const;
export const APELLIDO = { min: 2, max: 50 } as const;
export const DIRECCION = { min: 5, max: 100 } as const;

export const TELEFONO = {
  min: 7,
  max: 20,
  regex: /^[\d\s\-+()]*$/,
} as const;

export const EMAIL = {
  max: 254,
} as const;

export const TIPOS = ['alumno', 'docente', 'administrativo'] as const;