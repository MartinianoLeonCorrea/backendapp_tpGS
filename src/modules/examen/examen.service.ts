import { EntityManager } from '@mikro-orm/mysql';
import { Examen } from './examen.entity';
import { Dictado } from '../dictado/dictado.entity';
import { Persona } from '../persona/persona.entity';
import { Materia } from '../materia/materia.entity';

interface IExamenInput {
  fecha_examen?: Date | string;
  temas?: string;
  dictadoId?: number;
  copias?: number;
  [key: string]: any; // Para flexibilidad si hay más campos
}

class ExamenService {
  // Función para obtener todos los exámenes con sus relaciones
  async getAllExamenes(em: EntityManager) {
    // Usamos populate para traer las relaciones anidadas
    return await em.find(Examen, {}, {
      populate: ['dictado', 'dictado.materia', 'dictado.docente'] as any
    });
  }

  // Función para obtener un examen por ID
  async getExamenById(em: EntityManager, id: number) {
    try {
      // MikroORM usa findOne para buscar por ID o criterios
      const examen = await em.findOne(Examen, { id }, {
        populate: ['dictado', 'dictado.materia', 'dictado.docente'] as any
      });
      return examen;
    } catch (error) {
      throw error;
    }
  }

  // Función para crear un nuevo examen
  async createExamen(em: EntityManager, examenData: IExamenInput) {
    if (
      !examenData.fecha_examen ||
      !examenData.temas ||
      !examenData.dictadoId
    ) {
      throw new Error('Faltan datos obligatorios para crear el examen.');
    }

    // 2. Verificar que el dictadoId exista (usando la entidad)
    const dictado = await em.findOne(Dictado, { id: examenData.dictadoId });
    if (!dictado) {
      throw new Error(`El dictado con ID ${examenData.dictadoId} no existe.`);
    }

    // Creamos la instancia de la entidad
    const newExamen = em.create(Examen, {
      fechaExamen: new Date(examenData.fecha_examen),
      temas: examenData.temas,
      dictado: dictado,
      copias: examenData.copias || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Persistimos en la base de datos
    await em.persistAndFlush(newExamen);

    return newExamen;
  }

  // Función para actualizar un examen
  async updateExamen(em: EntityManager, id: number, updateData: IExamenInput) {
    const examen = await em.findOne(Examen, { id });
    if (!examen) {
      return null;
    }

    // Verificar dictado si viene en la data
    if (updateData.dictadoId) {
      const dictado = await em.findOne(Dictado, { id: updateData.dictadoId });
      if (!dictado) {
        throw new Error(`El dictado con ID ${updateData.dictadoId} no existe.`);
      }
      examen.dictado = dictado;
    }

    // Actualizamos campos manualmente o con assign
    if (updateData.fecha_examen) {
      examen.fechaExamen = new Date(updateData.fecha_examen);
    }
    
    em.assign(examen, {
      temas: updateData.temas || examen.temas,
      copias: updateData.copias !== undefined ? updateData.copias : examen.copias,
      updatedAt: new Date()
    });

    await em.flush();
    return examen;
  }

  // Función para eliminar un examen
  async deleteExamen(em: EntityManager, id: number) {
    const examen = await em.findOne(Examen, { id });
    if (!examen) return null;
    
    // Eliminamos y sincronizamos
    await em.removeAndFlush(examen);
    return examen;
  }

  // Funciones para búsquedas por relaciones
  async getExamenesByMateria(em: EntityManager, materiaId: number) {
    // MikroORM permite filtrar por propiedades de relaciones
    const examenes = await em.find(Examen, {
      dictado: { materia: { id: materiaId } }
    }, {
      populate: ['dictado', 'dictado.materia', 'dictado.docente'] as any
    });
    
    return examenes;
  }

  async getExamenesByDictadoId(em: EntityManager, dictadoId: number) {
    try {
      return await em.find(Examen, { dictado: { id: dictadoId } }, {
        populate: ['dictado', 'dictado.materia', 'dictado.docente'] as any
      });
    } catch (error) {
      console.error('Error en getExamenesByDictadoId:', error);
      return [];
    }
  }

  // ========================= HELPER FUNCTIONS ===========================

  _successResponse(message: string, data: any) {
    return { success: true, message, data };
  }

  _errorResponse(message: string, errors: string[] = []) {
    return { success: false, message, errors };
  }
}

export default new ExamenService();