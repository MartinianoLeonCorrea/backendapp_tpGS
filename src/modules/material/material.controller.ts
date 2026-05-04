import { Request, Response, NextFunction } from 'express';
import MaterialService from './material.service';

// ========================= CREATE =========================
export const createMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await MaterialService.createMaterial(req.body);
    res.status(201).json(MaterialService.successResponse('Material creado exitosamente', material));
  } catch (error: any) {
    if (error.message === 'El dictado no existe') {
      return res.status(404).json(MaterialService.errorResponse(error.message));
    }
    next(error);
  }
};

// ========================= READ ===========================
export const getAllMateriales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const materiales = await MaterialService.getAllMateriales();
    res.status(200).json(MaterialService.successResponse('Materiales obtenidos', materiales));
  } catch (error) {
    next(error);
  }
};

export const getMaterialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await MaterialService.getMaterialById(Number(req.params.id));
    if (!material) {
      return res.status(404).json(MaterialService.errorResponse('Material no encontrado'));
    }
    res.status(200).json(MaterialService.successResponse('Material encontrado', material));
  } catch (error) {
    next(error);
  }
};

export const getMaterialesByDictado = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const materiales = await MaterialService.getMaterialesByDictado(Number(req.params.dictadoId));
    res.status(200).json(MaterialService.successResponse('Materiales del dictado obtenidos', materiales));
  } catch (error) {
    next(error);
  }
};

// ========================= UPDATE =========================
export const updateMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await MaterialService.updateMaterial(Number(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json(MaterialService.errorResponse('Material no encontrado'));
    }
    res.status(200).json(MaterialService.successResponse('Material actualizado', updated));
  } catch (error) {
    next(error);
  }
};

// ========================= DELETE =========================
export const deleteMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await MaterialService.deleteMaterial(Number(req.params.id));
    if (!success) {
      return res.status(404).json(MaterialService.errorResponse('Material no encontrado'));
    }
    res.status(200).json(MaterialService.successResponse('Material eliminado', { id: Number(req.params.id) }));
  } catch (error) {
    next(error);
  }
};