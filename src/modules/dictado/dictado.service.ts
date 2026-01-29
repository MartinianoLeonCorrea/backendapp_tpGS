import { EntityManager } from '@mikro-orm/mysql';
import { Dictado } from './dictado.entity';
import { Curso } from '../curso/curso.entity';
import { Materia } from '../materia/materia.entity';
import { Persona } from '../persona/persona.entity';
import { Examen } from '../examen/examen.entity';

interface IDictadoInput {
  anio?: number;
  dias_cursado?: string;
  cursoId?: number;
  materiaId?: number;
  docenteId?: number;
  [key: string]: any;
}

class DictadoService {
  // ========================== CREATE ==========================

  async createDictado(em: EntityManager, data: IDictadoInput) {
    const { anio, dias_cursado, cursoId, materiaId, docenteId } = data;

    if (!anio || !dias_cursado || !cursoId || !materiaId || !docenteId) {
      throw new Error('Faltan datos obligatorios para crear el dictado.');
    }

    const curso = await em.findOne(Curso, cursoId);
    const materia = await em.findOne(Materia, materiaId);
    const docente = await em.findOne(Persona, docenteId);

    if (!curso || !materia || !docente) {
      throw new Error('Curso, materia o docente inexistente.');
    }

    const dictado = em.create(Dictado, {
      anio,
      diasCursado: dias_cursado,
      curso,
      materia,
      docente,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.persistAndFlush(dictado);
    return dictado;
  }

  // ========================== READ ============================

  async getAllDictados(em: EntityManager) {
    return em.find(Dictado, {}, {
      populate: ['curso', 'materia', 'docente', 'examenes'] as any,
    });
  }

  async getDictadosActivos(em: EntityManager) {
    const now = new Date();

    return em.find(
      Dictado,
      {
        fechaDesde: { $lte: now },
        fechaHasta: { $gte: now },
      },
      {
        populate: ['curso', 'materia', 'docente', 'examenes'] as any,
      }
    );
  }

  async getDictadoById(em: EntityManager, id: number) {
    return em.findOne(Dictado, id, {
      populate: [
        'curso',
        'curso.alumnos',
        'materia',
        'docente',
        'examenes',
      ] as any,
    });
  }

  async getDictadosByCurso(em: EntityManager, cursoId: number) {
    return em.find(
      Dictado,
      { curso: cursoId },
      { populate: ['curso', 'materia', 'docente'] as any }
    );
  }

  async getDictadosByPersona(em: EntityManager, docenteId: number) {
    return em.find(
      Dictado,
      { docente: docenteId },
      { populate: ['curso', 'materia', 'docente'] as any }
    );
  }

  async getDictadosByMateria(em: EntityManager, materiaId: number) {
    return em.find(
      Dictado,
      { materia: materiaId },
      { populate: ['curso', 'materia', 'docente'] as any }
    );
  }

  async getDictadosActivosByPersona(em: EntityManager, docenteId: number) {
    const now = new Date();

    return em.find(
      Dictado,
      {
        docente: docenteId,
        fechaDesde: { $lte: now },
        fechaHasta: { $gte: now },
      },
      {
        populate: ['curso', 'materia', 'docente', 'examenes'] as any,
      }
    );
  }

  async getDictadosByCursoAndMateria(
    em: EntityManager,
    cursoId: number,
    materiaId: number
  ) {
    return em.find(
      Dictado,
      {
        curso: cursoId,
        materia: materiaId,
      },
      {
        populate: ['curso', 'materia', 'docente', 'examenes'] as any,
      }
    );
  }

  // ========================== UPDATE ==========================

  async updateDictado(
    em: EntityManager,
    id: number,
    data: IDictadoInput
  ) {
    const dictado = await em.findOne(Dictado, id);
    if (!dictado) return null;

    if (data.cursoId) {
      const curso = await em.findOne(Curso, data.cursoId);
      if (!curso) throw new Error('Curso inexistente.');
      dictado.curso = curso;
    }

    if (data.materiaId) {
      const materia = await em.findOne(Materia, data.materiaId);
      if (!materia) throw new Error('Materia inexistente.');
      dictado.materia = materia;
    }

    if (data.docenteId) {
      const docente = await em.findOne(Persona, data.docenteId);
      if (!docente) throw new Error('Docente inexistente.');
      dictado.docente = docente;
    }

    if (data.anio !== undefined) {
      dictado.anio = data.anio;
    }

    if (data.dias_cursado !== undefined) {
      dictado.diasCursado = data.dias_cursado;
    }

    dictado.updatedAt = new Date();

    await em.flush();
    return dictado;
  }

  // ========================= DELETE =========================

  async deleteDictado(em: EntityManager, id: number) {
    const dictado = await em.findOne(Dictado, id);
    if (!dictado) return null;

    const examenesCount = await em.count(Examen, {
      dictado: id,
    });

    if (examenesCount > 0) {
      throw new Error(
        'No se puede eliminar el dictado porque tiene exámenes asociados.'
      );
    }

    await em.removeAndFlush(dictado);
    return dictado;
  }
}

export default new DictadoService();
