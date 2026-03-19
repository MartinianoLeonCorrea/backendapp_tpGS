import { EntityManager } from '@mikro-orm/core';
import { orm } from '../../config/mikro-orm';
import { Dictado } from './dictado.entity';
import { Curso } from '../curso/curso.entity';
import { Materia } from '../materia/materia.entity';
import { Persona } from '../persona/persona.entity';
import { Examen } from '../examen/examen.entity';

class DictadoService {
  private get em() {
    return orm.em.fork();
  }

  // ========================== CREATE ==========================
  async createDictado(data: any) {
    const em = this.em;
    const { anio, diasCursado, cursoId, materiaId, docenteId } = data;

    // Buscar las entidades relacionadas
    const curso = await em.findOne(Curso, { id: cursoId });
    const materia = await em.findOne(Materia, { id: materiaId });
    const docente = await em.findOne(Persona, { dni: docenteId });

    if (!curso || !materia || !docente) {
      throw new Error('Curso, materia o docente no encontrado');
    }

    const dictado = em.create(Dictado, {
      anio,
      diasCursado,
      curso,
      materia,
      docente,
      createdAt: '',
      updatedAt: ''
    });

    await em.persistAndFlush(dictado);
    return dictado;
  }

  // ========================== READ ============================
  async getAllDictados() {
    return await this.em.find(Dictado, {}, {
      populate: ['curso', 'materia', 'docente', 'examenes'],
    });
  }

  async getDictadoById(id: number) {
    return await this.em.findOne(Dictado, { id }, {
      populate: ['curso', 'curso.alumnos', 'materia', 'docente', 'examenes'],
    });
  }

  async getDictadosByCurso(cursoId: number) {
    return await this.em.find(Dictado, { curso: cursoId }, {
      populate: ['curso', 'materia', 'docente', 'examenes'],
    });
  }

  async getDictadosByPersona(docenteId: number) {
    return await this.em.find(Dictado, { docente: { dni: docenteId } }, {
      populate: ['curso', 'materia', 'docente', 'examenes'],
    });
  }

  async getDictadosByMateria(materiaId: number) {
    return await this.em.find(Dictado, { materia: materiaId }, {
      populate: ['curso', 'materia', 'docente', 'examenes'],
    });
  }

  async getDictadosActivos() {
    const now = new Date();
    return await this.em.find(Dictado, {
      fechaDesde: { $lte: now },
      fechaHasta: { $gte: now },
    }, {
      populate: ['curso', 'materia', 'docente', 'examenes'],
    });
  }

  async getDictadosActivosByPersona(docenteId: number) {
    const now = new Date();
    return await this.em.find(Dictado, {
      docente: { dni: docenteId },
      fechaDesde: { $lte: now },
      fechaHasta: { $gte: now },
    }, {
      populate: ['curso', 'materia', 'docente', 'examenes'],
    });
  }

  async getDictadosByCursoAndMateria(cursoId: number, materiaId: number) {
    return await this.em.find(Dictado, {
      curso: cursoId,
      materia: materiaId,
    }, {
      populate: ['curso', 'materia', 'docente', 'examenes'],
    });
  }

  // ========================== UPDATE ==========================
  async updateDictado(id: number, data: any) {
    const em = this.em;
    const dictado = await em.findOne(Dictado, { id });

    if (!dictado) return null;

    // Actualizar relaciones si vienen en data
    if (data.cursoId) {
      const curso = await em.findOne(Curso, { id: data.cursoId });
      if (!curso) throw new Error('Curso no encontrado');
      dictado.curso = curso;
    }

    if (data.materiaId) {
      const materia = await em.findOne(Materia, { id: data.materiaId });
      if (!materia) throw new Error('Materia no encontrada');
      dictado.materia = materia;
    }

    if (data.docenteId) {
      const docente = await em.findOne(Persona, { dni: data.docenteId });
      if (!docente) throw new Error('Docente no encontrado');
      dictado.docente = docente;
    }

    // Actualizar campos simples
    if (data.anio !== undefined) dictado.anio = data.anio;
    if (data.diasCursado !== undefined) dictado.diasCursado = data.diasCursado;

    await em.flush();
    return dictado;
  }

  // ========================= DELETE =========================
  async deleteDictado(id: number) {
    const em = this.em;
    const dictado = await em.findOne(Dictado, { id });

    if (!dictado) return null;

    // Verificar si tiene exámenes asociados
    const examenesCount = await em.count(Examen, { dictado: id });
    if (examenesCount > 0) {
      throw new Error('No se puede eliminar el dictado porque tiene exámenes asociados');
    }

    await em.removeAndFlush(dictado);
    return dictado;
  }
}

export default new DictadoService();