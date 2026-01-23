import Persona from '../persona/persona.model';
import Examen from './examen.model';
import Materia from '../materia/materia.model';
import Dictado from '../dictado/dictado.model';

interface IExamenInput {
  fecha_examen?: Date | string;
  temas?: string;
  dictadoId?: number;
  copias?: number;
  [key: string]: any; // Para flexibilidad si hay más campos
}

class ExamenService {
  // Función para obtener todos los exámenes con sus relaciones
  async getAllExamenes() {
    return await Examen.findAll({
      include: [
        {
          model: Dictado,
          as: 'dictado',
          attributes: ['id', 'dias_cursado', 'materiaId'],
          include: [
            { model: Materia, as: 'materia', attributes: ['id', 'nombre'] },
            {
              model: Persona,
              as: 'docente',
              attributes: ['nombre', 'apellido'],
            },
          ],
        },
      ],
    });
  }

  // Función para obtener un examen por ID
  async getExamenById(id: number) {
    try {
      const examen = await Examen.findByPk(id, {
        include: [
          {
            model: Dictado,
            as: 'dictado',
            attributes: ['id', 'dias_cursado', 'materiaId'],
            include: [
              { model: Materia, as: 'materia', attributes: ['nombre'] },
              {
                model: Persona,
                as: 'docente',
                attributes: ['nombre', 'apellido'],
              },
            ],
          },
        ],
      });
      return examen;
    } catch (error) {
      throw error;
    }
  }

  // Función para crear un nuevo examen
  async createExamen(examenData: IExamenInput) {
    if (
      !examenData.fecha_examen ||
      !examenData.temas ||
      !examenData.dictadoId
    ) {
      throw new Error('Faltan datos obligatorios para crear el examen.');
    }

    // 2. Verificar que el dictadoId exista
    const dictado = await Dictado.findByPk(examenData.dictadoId);
    if (!dictado) {
      throw new Error(`El dictado con ID ${examenData.dictadoId} no existe.`);
    }

    const payload = {
      fecha_examen: new Date(examenData.fecha_examen),
      temas: examenData.temas,
      dictadoId: examenData.dictadoId,
      copias: examenData.copias || 0,
    };

    const newExamen = await Examen.create(payload);

    return this.getExamenById(newExamen.id);
  }

  // Función para actualizar un examen
  async updateExamen(id: number, updateData: IExamenInput) {
    const examen = await Examen.findByPk(id);
    if (!examen) {
      return null;
    }

    // Verificar dictado si viene en la data
    if (updateData.dictadoId) {
      const dictado = await Dictado.findByPk(updateData.dictadoId);
      if (!dictado) {
        throw new Error(`El dictado con ID ${updateData.dictadoId} no existe.`);
      }
    }

    const payload: any = { ...updateData };

    if (updateData.fecha_examen) {
      payload.fecha_examen = new Date(updateData.fecha_examen);
    }

    await examen.update(payload);
    return this.getExamenById(id);
  }

  // Función para eliminar un examen
  async deleteExamen(id: number) {
    const examen = await Examen.findByPk(id);
    if (!examen) return null;
    await examen.destroy();
    return examen;
  }

  // Funciones para búsquedas por relaciones
  async getExamenesByMateria(materiaId: number) {
    // Buscar dictados de la materia
    const dictados = await Dictado.findAll({
      where: { materiaId },
      attributes: ['id'],
    });

    // Tipamos explícitamente el map para evitar errores
    const dictadoIds: number[] = dictados.map((d: any) => d.id);

    console.log('Dictado IDs:', dictadoIds);
    if (!dictadoIds.length) {
      return [];
    }

    const examenes = await Examen.findAll({
      where: { dictadoId: dictadoIds },
      include: [
        {
          model: Dictado,
          as: 'dictado',
          attributes: ['id', 'dias_cursado', 'materiaId', 'docenteId'],
          include: [
            { model: Materia, as: 'materia', attributes: ['id', 'nombre'] },
            {
              model: Persona,
              as: 'docente',
              attributes: ['id', 'nombre', 'apellido'],
            },
          ],
        },
      ],
    });
    console.log('Examenes encontrados:', examenes);
    return examenes;
  }

  async getExamenesByDictadoId(dictadoId: number) {
    try {
      return await Examen.findAll({
        where: { dictadoId },
        include: [
          {
            model: Dictado,
            as: 'dictado',
            attributes: ['id', 'dias_cursado', 'materiaId', 'docenteId'],
            include: [
              { model: Materia, as: 'materia', attributes: ['id', 'nombre'] },
              {
                model: Persona,
                as: 'docente',
                attributes: ['dni', 'nombre', 'apellido'],
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error('Error en getExamenesByDictadoId:', error);
      return [];
    }
  }

  // ========================= HELPER FUNCTIONS ===========================

  // Función para construir una respuesta de éxito estandarizada
  _successResponse(message: string, data: any) {
    return {
      success: true,
      message,
      data,
    };
  }

  // Función para construir una respuesta de error estandarizada
  _errorResponse(message: string, errors: string[] = []) {
    return {
      success: false,
      message,
      errors,
    };
  }
}

export default new ExamenService();
