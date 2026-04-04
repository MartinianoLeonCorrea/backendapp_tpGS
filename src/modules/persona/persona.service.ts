import { orm } from '../../config/mikro-orm';
import { Persona, TipoPersona } from './persona.entity';
import { Curso } from '../curso/curso.entity';
import { User } from '../user/user.entity';
import bcrypt from 'bcrypt'; // nuevos imports     

class PersonaService {
  private get em() {
    return orm.em.fork();
  }

  // ========================= CREATE =========================
  async createPersona(data: any) {
    const em = this.em;
    const { cursoId, ...personaData } = data;
    const persona = em.create(Persona, personaData);

    if (personaData.tipo === TipoPersona.ALUMNO && cursoId) {
      const curso = await em.findOne(Curso, { id: Number(cursoId) });
      if (!curso) {
        throw new Error('El curso seleccionado no existe');
      }

      persona.curso = curso;
    }

    if (personaData.tipo === TipoPersona.ALUMNO) {
      const existingUser = await em.findOne(User, { email: personaData.email });
      if (existingUser) {
        throw new Error('Ya existe un usuario registrado con ese email');
      }

      const rawPassword = String(personaData.dni).slice(-4); // últimos 4 dígitos
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      await em.persistAndFlush(persona); // primero la persona

      const user = em.create(User, {
        email: personaData.email,
        dni: String(personaData.dni),
        password: hashedPassword,
        active: true,
        persona: persona,
        createdAt: new Date(),
      });

      await em.persistAndFlush(user);
    } else {
      await em.persistAndFlush(persona);
    }

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

    const { cursoId, ...restData } = data;
    Object.assign(persona, restData);

    if (cursoId !== undefined) {
      if (cursoId === null || cursoId === '') {
        persona.curso = undefined;
      } else {
        const curso = await em.findOne(Curso, { id: Number(cursoId) });
        if (!curso) {
          throw new Error('El curso seleccionado no existe');
        }
        persona.curso = curso;
      }
    }

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