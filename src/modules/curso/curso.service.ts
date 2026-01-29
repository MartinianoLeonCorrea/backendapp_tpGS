import { EntityManager } from '@mikro-orm/mysql';
import { Curso, Turno } from './curso.entity';
import { Persona, TipoPersona } from '../persona/persona.entity';
import { RequiredEntityData } from '@mikro-orm/core';


interface ICursoInput {
  nroLetra?: string;
  turno?: Turno;
}

class CursoService {
  // ========================= CREATE =========================

  async createCurso(em: EntityManager, cursoData: ICursoInput) {
    if (!cursoData.nroLetra || !cursoData.turno) {
      throw new Error('Faltan datos obligatorios para crear el curso.');
    }

    const data: RequiredEntityData<Curso> = {
      nroLetra: cursoData.nroLetra,
      turno: cursoData.turno,
    };

    const newCurso = em.create(Curso, data);

    await em.persistAndFlush(newCurso);
    return newCurso;
  }

  // ========================= READ ===========================

  async getAllCursos(em: EntityManager) {
    return em.find(Curso, {}, {
      orderBy: { nroLetra: 'ASC' },
    });
  }

  async getCursoById(
    em: EntityManager,
    id: number,
    options: {
      includeAlumnos?: boolean;
      includeDictados?: boolean;
    } = {}
  ) {
    const populate: string[] = [];

    if (options.includeAlumnos) populate.push('alumnos');
    if (options.includeDictados) populate.push('dictados');

    return em.findOne(Curso, { id }, {
      populate: populate as any,
    });
  }

  // ========================= UPDATE =========================

  async updateCurso(
    em: EntityManager,
    id: number,
    cursoData: ICursoInput
  ) {
    const curso = await em.findOne(Curso, { id });
    if (!curso) return null;

    if (cursoData.nroLetra !== undefined) {
      curso.nroLetra = cursoData.nroLetra;
    }

    if (cursoData.turno !== undefined) {
      curso.turno = cursoData.turno;
    }

    await em.flush();
    return curso;
  }

  // ========================= DELETE =========================

  async deleteCurso(em: EntityManager, id: number) {
    const curso = await em.findOne(Curso, { id });
    if (!curso) return null;

    const alumnosCount = await em.count(Persona, {
      curso: { id },
      tipo: TipoPersona.ALUMNO,
    });

    if (alumnosCount > 0) {
      throw new Error(
        'No se puede eliminar el curso porque tiene alumnos asignados.'
      );
    }

    await em.removeAndFlush(curso);
    return curso;
  }
}

export default new CursoService();
