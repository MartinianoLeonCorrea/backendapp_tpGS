const CursoService = require('./curso.service');

class CursoController {

  // ========================= CREATE =========================

  // Crear un nuevo curso

  static async createCurso(req, res, next) {
    try {
      const cursoData = req.body;
      
      // Validaciones básicas

      if (!cursoData.anio_letra || !cursoData.turno) {
        return res.status(400).json({ 
          message: 'Los campos año_letra y turno son obligatorios' 
        });
      }

      const newCurso = await CursoService.createCurso(cursoData);
      res.status(201).json({
        message: 'Curso creado exitosamente',
        data: newCurso
      });
    } catch (error) {
      next(error);
    }
  }

  // ========================= READ ===========================

  // Obtener todos los cursos

  static async getAllCursos(req, res, next) {
    try {
      const { includeAlumnos, includeDictados } = req.query;
      const options = {
        includeAlumnos: includeAlumnos === 'true',
        includeDictados: includeDictados === 'true'
      };

      const cursos = await CursoService.findAllCursos(options);
      res.status(200).json({
        message: 'Cursos obtenidos exitosamente',
        data: cursos,
        count: cursos.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener un curso por ID

  static async getCursoById(req, res, next) {
    try {
      const { id } = req.params;
      const { includeAlumnos, includeDictados } = req.query;
      
      const options = {
        includeAlumnos: includeAlumnos === 'true',
        includeDictados: includeDictados === 'true'
      };

      const curso = await CursoService.findCursoById(id, options);
      
      if (!curso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
      }

      res.status(200).json({
        message: 'Curso obtenido exitosamente',
        data: curso
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener cursos por turno

  static async getCursosByTurno(req, res, next) {
    try {
      const { turno } = req.params;
      const cursos = await CursoService.findCursosByTurno(turno.toUpperCase());
      
      res.status(200).json({
        message: `Cursos del turno ${turno} obtenidos exitosamente`,
        data: cursos,
        count: cursos.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de un curso

  static async getCursoStats(req, res, next) {
    try {
      const { id } = req.params;
      const stats = await CursoService.getCursoStats(id);
      
      if (!stats) {
        return res.status(404).json({ message: 'Curso no encontrado' });
      }

      res.status(200).json({
        message: 'Estadísticas del curso obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // ========================= UPDATE =========================

  // Actualizar un curso existente

  static async updateCurso(req, res, next) {
    try {
      const { id } = req.params;
      const cursoData = req.body;

      const updatedCurso = await CursoService.updateCurso(id, cursoData);
      
      if (!updatedCurso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
      }

      res.status(200).json({
        message: 'Curso actualizado exitosamente',
        data: updatedCurso
      });
    } catch (error) {
      next(error);
    }
  }

  // ========================= DELETE =========================

  // Eliminar un curso

  static async deleteCurso(req, res, next) {
    try {
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

  // Eliminar curso forzado
  
  static async forceDeleteCurso(req, res, next) {
    try {
      const { id } = req.params;
      const deletedCurso = await CursoService.forceDeleteCurso(id);
      
      if (!deletedCurso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
      }

      res.status(200).json({ message: 'Curso eliminado forzadamente exitosamente' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CursoController;