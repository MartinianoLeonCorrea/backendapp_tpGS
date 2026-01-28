import { EntityManager, wrap, FilterQuery } from '@mikro-orm/core';
import { orm } from '../../config/mikro-orm';
import { Persona, TipoPersona } from './persona.entity';

class PersonaService {
  // Helper para obtener el EntityManager (Unit of Work)
  private get em(): EntityManager {
    return orm.em.fork();
  }

  // ========================= HELPERS DE VALIDACIÓN (PÚBLICOS) =========================
  // Nota: Muchas validaciones de Sequelize ahora se delegan al PersonaSchema de Joi

  /** Verificar si un DNI ya existe */
  async findPersonaByDni(dni: number) {
    return await this.em.findOne(Persona, { dni });
  }

  // ========================= CREATE =========================

  /** Crear una nueva persona (Alumno o Docente) */
  async createPersona(data: any) {
    try {
      const em = this.em;
      const persona = em.create(Persona, data);
      await em.persistAndFlush(persona);
      return persona;
    } catch (error: any) {
      throw new Error('Error al crear persona: ' + error.message);
    }
  }

  // ========================= READ ===========================

  /** Obtener todas las personas con filtros */
  async findAllPersonas(filters: { tipo?: string; search?: string } = {}) {
    try {
      const where: FilterQuery<Persona> = {};
      
      if (filters.tipo) {
        where.tipo = filters.tipo as TipoPersona;
      }
      
      if (filters.search) {
        where.$or = [
          { nombre: { $ilike: `%${filters.search}%` } },
          { apellido: { $ilike: `%${filters.search}%` } }
        ];
      }

      return await this.em.find(Persona, where, { 
        populate: ['curso'] as any,
        orderBy: { apellido: 'ASC', nombre: 'ASC' }
      });
    } catch (error: any) {
      throw new Error('Error al obtener personas: ' + error.message);
    }
  }

  /** Obtener alumnos por ID de curso */
  async getAlumnosByCurso(cursoId: number) {
    return await this.em.find(Persona, { 
      curso: cursoId, 
      tipo: TipoPersona.ALUMNO 
    });
  }

  // ========================= UPDATE =========================

  /** Actualizar datos de una persona */
  async updatePersona(dni: number, data: any) {
    try {
      const em = this.em;
      const persona = await em.findOne(Persona, { dni });
      
      if (!persona) return null;

      wrap(persona).assign(data);
      await em.flush();
      return persona;
    } catch (error: any) {
      throw new Error('Error al actualizar persona: ' + error.message);
    }
  }

  // ========================= DELETE =========================

  /** Eliminar una persona por DNI */
  async deletePersona(dni: number) {
    try {
      const em = this.em;
      const persona = await em.findOne(Persona, { dni });
      
      if (!persona) return false;

      await em.removeAndFlush(persona);
      return true;
    } catch (error: any) {
      throw new Error('Error al eliminar persona: ' + error.message);
    }
  }

  // ========================= RESPONSES =========================

  successResponse(message: string, data: any) {
    return { success: true, message, data };
  }

  errorResponse(message: string, errors: string[] = []) {
    return { success: false, message, errors };
  }
}

export default new PersonaService();