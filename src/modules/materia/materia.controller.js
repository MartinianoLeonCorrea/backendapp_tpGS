const MateriaService = require('./materia.service');

// ========================= CREATE =========================

// Crear una nueva materia

const createMateria = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;

    // Validación básica en el controller

    const validationResult = MateriaService._validateCreateData({
      nombre,
      descripcion,
    });
    if (!validationResult.isValid) {
      return res
        .status(400)
        .json(
          MateriaService._errorResponse(
            'Error de validación',
            validationResult.errors
          )
        );
    }

    const newMateria = await MateriaService.createMateria({
      nombre,
      descripcion,
    });

    res
      .status(201)
      .json(
        MateriaService._successResponse(
          'Materia creada exitosamente',
          newMateria
        )
      );
  } catch (error) {
    next(error);
  }
};

// ========================= READ ===========================

// Obtener todas las materias con filtros y paginación

const getAllMaterias = async (req, res, next) => {
  try {
    const { page, limit, search, include } = req.query;

    // Validar parámetros de paginación

    const paginationValidation = MateriaService._validatePaginationParams({
      page,
      limit,
    });
    if (!paginationValidation.isValid) {
      return res
        .status(400)
        .json(
          MateriaService._errorResponse(
            'Parámetros de paginación inválidos',
            paginationValidation.errors
          )
        );
    }

    const options = {
      page: page ? parseInt(page) : null,
      limit: limit ? parseInt(limit) : null,
      search: search || null,
      includeRelations: include === 'relations',
    };

    const materias = await MateriaService.findAllMaterias(options);

    // Si hay paginación, obtener el total

    let totalCount = null;
    if (page && limit) {
      totalCount = await MateriaService.countMaterias(search);
    }

    const response = MateriaService._successResponse(
      'Materias obtenidas exitosamente',
      materias
    );

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
};

// Obtener una materia por ID

const getMateriaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { include } = req.query;

    // Validación básica del ID

    if (!MateriaService._isValidId(id)) {
      return res
        .status(400)
        .json(
          MateriaService._errorResponse('ID de materia inválido', [
            'ID debe ser un número válido',
          ])
        );
    }

    const includeRelations = include === 'relations';
    const materia = await MateriaService.findMateriaById(id, includeRelations);

    if (!materia) {
      return res
        .status(404)
        .json(
          MateriaService._errorResponse('Materia no encontrada', [
            `No existe una materia con ID ${id}`,
          ])
        );
    }

    res
      .status(200)
      .json(
        MateriaService._successResponse(
          'Materia encontrada exitosamente',
          materia
        )
      );
  } catch (error) {
    next(error);
  }
};

// ========================= UPDATE =========================

// Actualizar una materia existente

const updateMateria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    // Validaciones

    if (!MateriaService._isValidId(id)) {
      return res
        .status(400)
        .json(
          MateriaService._errorResponse('ID de materia inválido', [
            'ID debe ser un número válido',
          ])
        );
    }

    const validationResult = MateriaService._validateUpdateData({
      nombre,
      descripcion,
    });
    if (!validationResult.isValid) {
      return res
        .status(400)
        .json(
          MateriaService._errorResponse(
            'Error de validación',
            validationResult.errors
          )
        );
    }

    const updatedMateria = await MateriaService.updateMateria(id, {
      nombre,
      descripcion,
    });

    if (!updatedMateria) {
      return res
        .status(404)
        .json(
          MateriaService._errorResponse(
            'Materia no encontrada para actualizar',
            [`No existe una materia con ID ${id}`]
          )
        );
    }

    res
      .status(200)
      .json(
        MateriaService._successResponse(
          'Materia actualizada exitosamente',
          updatedMateria
        )
      );
  } catch (error) {
    next(error);
  }
};

// ========================= DELETE =========================

// Eliminar una materia

const deleteMateria = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!MateriaService._isValidId(id)) {
      return res
        .status(400)
        .json(
          MateriaService._errorResponse('ID de materia inválido', [
            'ID debe ser un número válido',
          ])
        );
    }

    const deleted = await MateriaService.deleteMateria(id);

    if (!deleted) {
      return res
        .status(404)
        .json(
          MateriaService._errorResponse('Materia no encontrada para eliminar', [
            `No existe una materia con ID ${id}`,
          ])
        );
    }

    res.status(200).json(
      MateriaService._successResponse('Materia eliminada exitosamente', {
        id: parseInt(id),
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMateria,
  getAllMaterias,
  getMateriaById,
  updateMateria,
  deleteMateria,
};
