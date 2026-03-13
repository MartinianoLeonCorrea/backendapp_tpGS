export interface IValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
}

export const NOTA: IValidationRule = {
  min: 0,
  max: 10,
  required: true,
};

export const OBSERVACION: IValidationRule = {
  min: 0,
  max: 500,
  required: false,
};

export const ALUMNO_ID: IValidationRule = {
  required: true,
};

export const EXAMEN_ID: IValidationRule = {
  required: true,
};


