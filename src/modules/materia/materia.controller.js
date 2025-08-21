const MateriaService = require('./materia.service');

class MateriaController {
    
    // ========================= CREATE =========================

    // Crear una nueva materia

    async createMateria(req, res, next) {
        try {
            const { nombre, descripcion } = req.body;

            // Validación básica en el controller

            const validationResult = MateriaService._validateCreateData({ nombre, descripcion });
            if (!validationResult.isValid) {
                return res.status(400).json(MateriaService._errorResponse(
                    'Error de validación',
                    validationResult.errors
                ));
            }

            const newMateria = await MateriaService.materiaService.createMateria({ nombre, descripcion });
            
            res.status(201).json(MateriaService._successResponse(
                'Materia creada exitosamente',
                newMateria
            ));
        } catch (error) {
            next(error);
        }
    }

    // ========================= READ ===========================

    // Obtener todas las materias con filtros y paginación

    async getAllMaterias(req, res, next) {
        try {
            const { page, limit, search, include } = req.query;
            
            // Validar parámetros de paginación

            const paginationValidation = MateriaService._validatePaginationParams({ page, limit });
            if (!paginationValidation.isValid) {
                return res.status(400).json(MateriaService._errorResponse(
                    'Parámetros de paginación inválidos',
                    paginationValidation.errors
                ));
            }
            
            const options = {
                page: page ? parseInt(page) : null,
                limit: limit ? parseInt(limit) : null,
                search: search || null,
                includeRelations: include === 'relations'
            };

            const materias = await MateriaService.materiaService.findAllMaterias(options);
            
            // Si hay paginación, obtener el total

            let totalCount = null;
            if (page && limit) {
                totalCount = await MateriaService.materiaService.countMaterias(search);
            }

            const response = MateriaService._successResponse('Materias obtenidas exitosamente', materias);

            // Agregar metadata de paginación si corresponde

            if (totalCount !== null) {
                response.pagination = MateriaService._buildPaginationMeta(
                    parseInt(page), 
                    parseInt(limit), 
                    totalCount
                );
            }

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    // Obtener una materia por ID

    async getMateriaById(req, res, next) {
        try {
            const { id } = req.params;
            const { include } = req.query;
            
            // Validación básica del ID

            if (!MateriaService._isValidId(id)) {
                return res.status(400).json(MateriaService._errorResponse(
                    'ID de materia inválido',
                    ['ID debe ser un número válido']
                ));
            }

            const includeRelations = include === 'relations';
            const materia = await MateriaService.materiaService.findMateriaById(id, includeRelations);
            
            if (!materia) {
                return res.status(404).json(MateriaService._errorResponse(
                    'Materia no encontrada',
                    [`No existe una materia con ID ${id}`]
                ));
            }

            res.status(200).json(MateriaService._successResponse(
                'Materia encontrada exitosamente',
                materia
            ));
        } catch (error) {
            next(error);
        }
    }

    // Buscar materias por nombre

    async searchMaterias(req, res, next) {
        try {
            const { q } = req.query;
            
            if (!q || q.trim() === '') {
                return res.status(400).json(MateriaService._errorResponse(
                    'Parámetro de búsqueda requerido',
                    ['El parámetro "q" es requerido para la búsqueda']
                ));
            }

            const materias = await MateriaService.materiaService.findMateriasByName(q);
            
            res.status(200).json(MateriaService._successResponse(
                `Búsqueda completada para "${q}"`,
                materias,
                {
                    searchTerm: q,
                    resultCount: materias.length
                }
            ));
        } catch (error) {
            next(error);
        }
    }

    // Obtener estadísticas de materias

    async getMateriaStats(req, res, next) {
        try {
            const stats = await MateriaService.materiaService.getMateriaStats();

            res.status(200).json(MateriaService._successResponse(
                'Estadísticas obtenidas exitosamente',
                stats
            ));
        } catch (error) {
            next(error);
        }
    }

    // ========================= UPDATE =========================

    // Actualizar una materia existente

    async updateMateria(req, res, next) {
        try {
            const { id } = req.params;
            const { nombre, descripcion } = req.body;

            // Validaciones

            if (!MateriaService._isValidId(id)) {
                return res.status(400).json(MateriaService._errorResponse(
                    'ID de materia inválido',
                    ['ID debe ser un número válido']
                ));
            }

            const validationResult = MateriaService._validateUpdateData({ nombre, descripcion });
            if (!validationResult.isValid) {
                return res.status(400).json(MateriaService._errorResponse(
                    'Error de validación',
                    validationResult.errors
                ));
            }

            const updatedMateria = await MateriaService.materiaService.updateMateria(id, { nombre, descripcion });
            
            if (!updatedMateria) {
                return res.status(404).json(MateriaService._errorResponse(
                    'Materia no encontrada para actualizar',
                    [`No existe una materia con ID ${id}`]
                ));
            }

            res.status(200).json(MateriaService._successResponse(
                'Materia actualizada exitosamente',
                updatedMateria
            ));
        } catch (error) {
            next(error);
        }
    }

    // Actualización parcial de una materia

    async patchMateria(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Validaciones

            if (!MateriaService._isValidId(id)) {
                return res.status(400).json(MateriaService._errorResponse(
                    'ID de materia inválido',
                    ['ID debe ser un número válido']
                ));
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json(MateriaService._errorResponse(
                    'No se proporcionaron datos para actualizar',
                    ['Se requiere al menos un campo para actualizar']
                ));
            }

            const updatedMateria = await MateriaService.materiaService.updateMateria(id, updateData);
            
            if (!updatedMateria) {
                return res.status(404).json(MateriaService._errorResponse(
                    'Materia no encontrada para actualizar',
                    [`No existe una materia con ID ${id}`]
                ));
            }

            res.status(200).json(MateriaService._successResponse(
                'Materia actualizada exitosamente',
                updatedMateria
            ));
        } catch (error) {
            next(error);
        }
    }

    // ========================= DELETE =========================

    // Eliminar una materia

    async deleteMateria(req, res, next) {
        try {
            const { id } = req.params;

            if (!MateriaService._isValidId(id)) {
                return res.status(400).json(MateriaService._errorResponse(
                    'ID de materia inválido',
                    ['ID debe ser un número válido']
                ));
            }

            const deleted = await MateriaService.materiaService.deleteMateria(id);
            
            if (!deleted) {
                return res.status(404).json(MateriaService._errorResponse(
                    'Materia no encontrada para eliminar',
                    [`No existe una materia con ID ${id}`]
                ));
            }

            res.status(200).json(MateriaService._successResponse(
                'Materia eliminada exitosamente',
                { id: parseInt(id) }
            ));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = MateriaController;