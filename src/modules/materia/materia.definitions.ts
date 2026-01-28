export const MATERIA_NOMBRE = {
  MIN: 2,
  MAX: 100,
  REQUIRED: true,
} as const; // 'as const' hace que los valores sean de solo lectura

export const MATERIA_DESCRIPCION = {
  MIN: 0,
  MAX: 1000,
  REQUIRED: false,
} as const;

export const MATERIA_ID = {
  MIN: 1,
  REQUIRED: true,
} as const;

export const PAGINATION = {
  PAGE_MIN: 1,
  PAGE_DEFAULT: 1,
  LIMIT_MIN: 1,
  LIMIT_MAX: 100,
  LIMIT_DEFAULT: 10,
} as const;

export const INCLUDE_OPTIONS = ['relations'] as const;