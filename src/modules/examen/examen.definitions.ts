export interface IValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  [key: string]: any;
}

export const FECHA_EXAMEN: IValidationRule = {
  required: true,
};

export const TEMAS: IValidationRule = {
  min: 5,
  max: 800,
  required: true,
};

export const COPIAS: IValidationRule = {
  min: 1,
  required: true,
};

export const DICTADO_ID: IValidationRule = {
  required: true,
};
