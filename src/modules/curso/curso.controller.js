const CursoService = require('./curso.service');
const { idParamSchema, getCursoQuerySchema } = require('./curso.schema');

class CursoController {
  // ========================= CREATE =========================

  // Crear un nuevo curso
  static async createCurso(req, res, next) {
    try {
      const newCurso = await CursoService.createCurso(req.body);
      res.status(201).json({
        message: 'Curso creado exitosamente',
        data: newCurso,
      });
    } catch (error) {
      next(error);
    }
  }

  // ========================= READ ===========================

  // Obtener todos los cursos
  static async getAllCursos(req, res, next) {
    try {
      const cursos = await CursoService.findAllCursos();
      res.status(200).json({
        message: 'Cursos obtenidos exitosamente',
        data: cursos,
        count: cursos.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener un curso por ID
  static async getCursoById(req, res, next) {
    try {
      const { error: paramError } = idParamSchema.validate(req.params);
      if (paramError) {
        return res.status(400).json({
          message: 'Error de validación en parámetros',
          errors: paramError.details.map((err) => err.message),
        });
      }

      const { error: queryError } = getCursoQuerySchema.validate(req.query);
      if (queryError) {
        return res.status(400).json({
          message: 'Error de validación en query params',
          errors: queryError.details.map((err) => err.message),
        });
      }

      const { id } = req.params;
      const { includeAlumnos, includeDictados } = req.query;

      const options = {
        includeAlumnos: includeAlumnos === 'true',
        includeDictados: includeDictados === 'true',
      };

      const curso = await CursoService.findCursoById(id, options);

      if (!curso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
      }

      res.status(200).json({
        message: 'Curso obtenido exitosamente',
        data: curso,
      });
    } catch (error) {
      next(error);
    }
  }

  // ========================= UPDATE =========================

  // Actualizar un curso existente
  static async updateCurso(req, res, next) {
    try {
      const { error: paramError } = idParamSchema.validate(req.params);
      if (paramError) {
        return res.status(400).json({
          message: 'Error de validación en parámetros',
          errors: paramError.details.map((err) => err.message),
        });
      }

      const { id } = req.params;
      const updatedCurso = await CursoService.updateCurso(id, req.body);

      if (!updatedCurso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
      }

      res.status(200).json({
        message: 'Curso actualizado exitosamente',
        data: updatedCurso,
      });
    } catch (error) {
      next(error);
    }
  }

  // ========================= DELETE =========================

  // Eliminar un curso
  static async deleteCurso(req, res, next) {
    try {
      const { error: paramError } = idParamSchema.validate(req.params);
      if (paramError) {
        return res.status(400).json({
          message: 'Error de validación en parámetros',
          errors: paramError.details.map((err) => err.message),
        });
      }

      const { id } = req.params;
      const deletedCurso = await CursoService.deleteCurso(id);

      if (!deletedCurso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
      }

      res.status(200).json({ message: 'Curso eliminado exitosamente' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CursoController;