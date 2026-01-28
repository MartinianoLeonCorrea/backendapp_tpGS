import { Request, Response, NextFunction } from 'express';
import PersonaService from './persona.service';
import { sanitizeObjectStrings } from '../../utils/sanitize';

// Interfaz para ayudar a TS con el objeto sanitizado
interface PersonaInput {
  dni: number;
  nombre: string;
  apellido: string;
  tipo: string;
  cursoId?: number;
  [key: string]: any;
}

// ========================= CREATE =========================

/** Crear un alumno */
export const createAlumno = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alumnoData = sanitizeObjectStrings({ ...req.body, tipo: 'alumno' }) as PersonaInput;

    // Verificar si el DNI ya existe
    const existingAlumno = await PersonaService.findPersonaByDni(alumnoData.dni);
    if (existingAlumno) {
      return res.status(400).json(
        PersonaService.errorResponse('DNI duplicado', [
          'El DNI ya está registrado en el sistema. Verifique los datos.',
        ])
      );
    }

    const newAlumno = await PersonaService.createPersona(alumnoData);
    res.status(201).json(
      PersonaService.successResponse('Alumno creado exitosamente', newAlumno)
    );
  } catch (error) {
    next(error);
  }
};

/** Crear un docente */
export const createDocente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const docenteData = sanitizeObjectStrings({ ...req.body, tipo: 'docente' }) as PersonaInput;

    const existingDocente = await PersonaService.findPersonaByDni(docenteData.dni);
    if (existingDocente) {
      return res.status(400).json(
        PersonaService.errorResponse('DNI duplicado', ['El DNI ya está registrado.'])
      );
    }

    const newDocente = await PersonaService.createPersona(docenteData);
    res.status(201).json(
      PersonaService.successResponse('Docente creado exitosamente', newDocente)
    );
  } catch (error) {
    next(error);
  }
};

// ========================= READ ===========================

/** Obtener todas las personas con filtros */
export const getAllPersonas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipo, search } = req.query;
    const personas = await PersonaService.findAllPersonas({
      tipo: tipo as string,
      search: search as string,
    });
    res.status(200).json(PersonaService.successResponse('Personas obtenidas con éxito', personas));
  } catch (error) {
    next(error);
  }
};

/** Obtener alumnos de un curso específico */
export const getAlumnosByCurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cursoId } = req.params;
    const alumnos = await PersonaService.getAlumnosByCurso(Number(cursoId));
    res.status(200).json(PersonaService.successResponse('Alumnos del curso obtenidos', alumnos));
  } catch (error) {
    next(error);
  }
};

/** Obtener una persona por su DNI */
export const getPersonaByDni = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dni } = req.params;
    const persona = await PersonaService.findPersonaByDni(Number(dni));
    
    if (!persona) {
      return res.status(404).json(PersonaService.errorResponse('Persona no encontrada'));
    }
    
    res.status(200).json(PersonaService.successResponse('Persona encontrada', persona));
  } catch (error) {
    next(error);
  }
};

// ========================= UPDATE =========================

/** Actualizar datos de una persona */
export const updatePersona = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dni } = req.params;
    const data = sanitizeObjectStrings(req.body);
    
    const updated = await PersonaService.updatePersona(Number(dni), data);
    
    if (!updated) {
      return res.status(404).json(PersonaService.errorResponse('Persona no encontrada para actualizar'));
    }
    
    res.status(200).json(PersonaService.successResponse('Persona actualizada exitosamente', updated));
  } catch (error) {
    next(error);
  }
};

// ========================= DELETE =========================

/** Eliminar una persona */
export const deletePersona = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dni } = req.params;
    const success = await PersonaService.deletePersona(Number(dni));
    
    if (!success) {
      return res.status(404).json(
        PersonaService.errorResponse('Persona no encontrada', [`No se encontró la persona con DNI ${dni}`])
      );
    }
    
    res.status(200).json(PersonaService.successResponse('Persona eliminada exitosamente', { dni: Number(dni) }));
  } catch (error) {
    next(error);
  }
};