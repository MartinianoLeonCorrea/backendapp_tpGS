import { orm } from '../../config/mikro-orm';
import { Persona, TipoPersona } from './persona.entity';

class PersonaService {
  private get em() {
    return orm.em.fork();
  }

  // ========================= CREATE =========================
  async createPersona(data: any) {
    const em = this.em;
    const persona = em.create(Persona, data);
    await em.persistAndFlush(persona);
    return persona;
  }

  // ========================= READ ===========================
  async findPersonaByDni(dni: number) {
    return await this.em.findOne(Persona, { dni }, { populate: ['curso'] });
  }

  async findAllPersonas(filters: { tipo?: string; search?: string } = {}) {
    const em = this.em;
    const where: any = {};
    
    if (filters.tipo) {
      where.tipo = filters.tipo as TipoPersona;
    }
    
    if (filters.search) {
      where.$or = [
        { nombre: { $like: `%${filters.search}%` } },
        { apellido: { $like: `%${filters.search}%` } },
      ];
    }

    return await em.find(Persona, where, { 
      populate: ['curso'],
      orderBy: { apellido: 'ASC', nombre: 'ASC' },
    });
  }

  async getAlumnosByCurso(cursoId: number) {
    return await this.em.find(Persona, { 
      curso: cursoId, 
      tipo: TipoPersona.ALUMNO,
    });
  }

  // ========================= UPDATE =========================
  async updatePersona(dni: number, data: any) {
    const em = this.em;
    const persona = await em.findOne(Persona, { dni });
    
    if (!persona) return null;

    Object.assign(persona, data);
    await em.flush();
    return persona;
  }

  // ========================= DELETE =========================
  async deletePersona(dni: number) {
    const em = this.em;
    const persona = await em.findOne(Persona, { dni });
    
    if (!persona) return false;

    await em.removeAndFlush(persona);
    return true;
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