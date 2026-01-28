import { Request, Response, NextFunction } from 'express';
import MateriaService from './materia.service';
import { sanitizeObjectStrings } from '../../utils/sanitize';

// ========================= CREATE =========================

/** Crear una nueva materia */
export const createMateria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sanitizedData = sanitizeObjectStrings(req.body);
    const { nombre, descripcion } = sanitizedData as { nombre: string; descripcion?: string };

    const newMateria = await MateriaService.createMateria({ nombre, descripcion });

    res.status(201).json(
      MateriaService._successResponse('Materia creada exitosamente', newMateria)
    );
  } catch (error) {
    next(error);
  }
};

// ========================= READ ===========================

/** Obtener todas las materias con filtros y paginación */
export const getAllMaterias = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, include } = req.query;

    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string || undefined,
      includeRelations: include === 'relations',
    };

    const materias = await MateriaService.findAllMaterias(options);
    let totalCount: number | null = null;

    if (options.page && options.limit) {
      totalCount = await MateriaService.countMaterias(options.search);
    }

    const response = MateriaService._successResponse('Materias obtenidas exitosamente', materias);

    if (totalCount !== null && options.page && options.limit) {
      (response as any).pagination = MateriaService._buildPaginationMeta(
        options.page,
        options.limit,
        totalCount
      );
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/** Obtener una materia por ID */
export const getMateriaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { include } = req.query;

    const materia = await MateriaService.findMateriaById(Number(id), include === 'relations');

    if (!materia) {
      return res.status(404).json(
        MateriaService._errorResponse('Materia no encontrada', [`No existe una materia con ID ${id}`])
      );
    }

    res.status(200).json(MateriaService._successResponse('Materia encontrada exitosamente', materia));
  } catch (error) {
    next(error);
  }
};

// ========================= UPDATE =========================

/** Actualizar una materia existente */
export const updateMateria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const sanitizedData = sanitizeObjectStrings(req.body) as { nombre?: string; descripcion?: string };

    const updatedMateria = await MateriaService.updateMateria(Number(id), sanitizedData);

    if (!updatedMateria) {
      return res.status(404).json(
        MateriaService._errorResponse('Materia no encontrada para actualizar', [`No existe una materia con ID ${id}`])
      );
    }

    res.status(200).json(MateriaService._successResponse('Materia actualizada exitosamente', updatedMateria));
  } catch (error) {
    next(error);
  }
};

// ========================= DELETE =========================

/** Eliminar una materia */
export const deleteMateria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await MateriaService.deleteMateria(Number(id));

    if (!deleted) {
      return res.status(404).json(
        MateriaService._errorResponse('Materia no encontrada para eliminar', [`No existe una materia con ID ${id}`])
      );
    }

    res.status(200).json(MateriaService._successResponse('Materia eliminada exitosamente', { id: Number(id) }));
  } catch (error) {
    next(error);
  }
};