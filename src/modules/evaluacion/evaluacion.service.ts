import { EntityManager, wrap } from '@mikro-orm/core';
import { orm } from '../../config/mikro-orm';
import { Evaluacion } from './evaluacion.entity';
import { Examen } from '../examen/examen.entity';
import { Persona } from '../persona/persona.entity';

// ========================== INTERFACES ==========================
interface IEvaluacionInput {
  nota?: number;
  observacion?: string;
  examenId?: number;
  alumnoId?: number;
}

interface IFindAllOptions {
  examenId?: number;
  alumnoDni?: number;
  dictadoId?: number;
  page: number;
  limit: number;
}

class EvaluacionService {
  private get em(): EntityManager {
    return orm.em.fork();
  }

  private async getAlumnoForeignKeyColumn(em: EntityManager) {
    const fkRows = await em.getConnection().execute(
      `SELECT kcu.COLUMN_NAME AS column_name
       FROM information_schema.KEY_COLUMN_USAGE kcu
       WHERE kcu.TABLE_SCHEMA = DATABASE()
         AND kcu.TABLE_NAME = 'evaluaciones'
         AND kcu.REFERENCED_TABLE_NAME = 'personas'
         AND kcu.REFERENCED_COLUMN_NAME = 'dni'`,
    );

    const getColumnName = (row: any) =>
      row?.column_name ?? row?.COLUMN_NAME ?? row?.columnName ?? null;

    if (Array.isArray(fkRows) && fkRows.length > 0) {
      const detectedFk = getColumnName(fkRows[0]);
      if (typeof detectedFk === 'string' && detectedFk.trim() !== '') {
        return detectedFk;
      }
    }

    // Fallback por compatibilidad con esquemas que no tengan FK declarada.
    const columnRows = await em.getConnection().execute(
      `SELECT COLUMN_NAME AS column_name
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'evaluaciones'`,
    );

    const columnNames = Array.isArray(columnRows)
      ? columnRows
          .map((row: any) => getColumnName(row))
          .filter((value: any) => typeof value === 'string')
      : [];

    const normalized = new Map(
      columnNames.map((name: string) => [name.toLowerCase(), name]),
    );

    return (
      normalized.get('alumnoid') ||
      normalized.get('alumno_dni') ||
      normalized.get('alumno_id') ||
      null
    );
  }
  // ========================== HELPERS ==========================

  _successResponse(message: string, data: any) {
    return { success: true, message, data };
  }

  _errorResponse(message: string, errors: string[] = []) {
    return { success: false, message, errors };
  }

  // ========================== CREATE ==========================

  async createEvaluacion(data: IEvaluacionInput) {
    const em = this.em;

    const examen = await em.findOne(Examen, { id: data.examenId });
    if (!examen) {
      throw new Error(`El examen con ID ${data.examenId} no existe.`);
    }

    const alumno = await em.findOne(Persona, { dni: data.alumnoId });
    if (!alumno) {
      throw new Error(`El alumno con DNI ${data.alumnoId} no existe.`);
    }

    const evaluacion = em.create(Evaluacion, {
      nota: data.nota!,
      observacion: data.observacion,
      examen,
      alumno,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.persistAndFlush(evaluacion);
    return evaluacion;
  }

  async createBatchEvaluaciones(evaluaciones: IEvaluacionInput[]) {
    const em = this.em;
    const created: Array<{
      id: number;
      nota: number | null;
      observacion?: string | null;
      examenId?: number;
      alumnoId?: number;
    }> = [];
    const alumnoFkColumn = await this.getAlumnoForeignKeyColumn(em);

    if (!alumnoFkColumn) {
      throw new Error(
        'No se pudo detectar la columna FK del alumno en evaluaciones.',
      );
    }
    // Usamos una transacción para que el batch sea atómico:
    // si falla una, no se guarda ninguna
    await em.transactional(async (tem) => {
      for (const data of evaluaciones) {
        const examen = await tem.findOne(Examen, { id: data.examenId });
        if (!examen) {
          throw new Error(`El examen con ID ${data.examenId} no existe.`);
        }

        const alumno = await tem.findOne(Persona, { dni: data.alumnoId });
        if (!alumno) {
          throw new Error(`El alumno con DNI ${data.alumnoId} no existe.`);
        }

        const insertResult = await tem.getConnection().execute(
          `INSERT INTO evaluaciones (nota, observacion, created_at, updated_at, examen_id, ${alumnoFkColumn})
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            data.nota ?? null,
            data.observacion ?? null,
            new Date(),
            new Date(),
            examen.id,
            alumno.dni,
          ],
        );

        const insertedId = Array.isArray(insertResult)
          ? (insertResult as any)[0]?.insertId
          : (insertResult as any)?.insertId;

        if (insertedId) {
          created.push({
            id: Number(insertedId),
            nota: data.nota ?? null,
            observacion: data.observacion ?? null,
            examenId: examen.id,
            alumnoId: alumno.dni,
          });
        }
      }
    });

    return created;
  }

  // ========================== READ ============================

  async findAllEvaluaciones(options: IFindAllOptions) {
    const { examenId, alumnoDni, dictadoId, page, limit } = options;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (examenId) where.examen = { id: examenId };
    if (alumnoDni) where.alumno = { dni: alumnoDni };
    if (dictadoId)
      where.examen = { ...where.examen, dictado: { id: dictadoId } };

    return await this.em.find(Evaluacion, where, {
      populate: ['examen', 'alumno'] as any,
      offset,
      limit,
    });
  }

  async countEvaluaciones(options: {
    examenId?: number;
    alumnoDni?: number;
    dictadoId?: number;
  }) {
    const { examenId, alumnoDni, dictadoId } = options;

    const where: any = {};
    if (examenId) where.examen = { id: examenId };
    if (alumnoDni) where.alumno = { dni: alumnoDni };
    if (dictadoId)
      where.examen = { ...where.examen, dictado: { id: dictadoId } };

    return await this.em.count(Evaluacion, where);
  }

  async findEvaluacionById(
    id: number,
    { includeExamen = false, includeAlumno = false } = {},
  ) {
    const populate: string[] = [];
    if (includeExamen) populate.push('examen');
    if (includeAlumno) populate.push('alumno');

    return await this.em.findOne(
      Evaluacion,
      { id },
      { populate: populate as any },
    );
  }

  async findEvaluacionesByExamen(examenId: number) {
    return await this.em.find(
      Evaluacion,
      { examen: { id: examenId } },
      {
        populate: ['examen', 'alumno'] as any,
      },
    );
  }

  async findEvaluacionesByAlumno(alumnoId: number) {
    return await this.em.find(
      Evaluacion,
      { alumno: { dni: alumnoId } },
      {
        populate: [
          'examen',
          'examen.dictado',
          'examen.dictado.materia',
          'alumno',
        ] as any,
      },
    );
  }

  async findEvaluacionByExamenAndAlumno(examenId: number, alumnoId: number) {
    return await this.em.findOne(Evaluacion, {
      examen: { id: examenId },
      alumno: { dni: alumnoId },
    });
  }

  // Usados por el controlador para validaciones antes de crear una evaluación
  async getExamenById(id: number) {
    return await this.em.findOne(
      Examen,
      { id },
      {
        populate: ['dictado', 'dictado.curso'] as any,
      },
    );
  }

  async getPersonaByDni(dni: number) {
    return await this.em.findOne(
      Persona,
      { dni },
      {
        populate: ['curso'] as any,
      },
    );
  }

  // ========================== UPDATE ==========================

  async updateEvaluacion(id: number, updateData: Partial<IEvaluacionInput>) {
    const em = this.em;
    const evaluacion = await em.findOne(Evaluacion, { id });
    if (!evaluacion) return null;

    wrap(evaluacion).assign({
      nota: updateData.nota ?? evaluacion.nota,
      observacion: updateData.observacion ?? evaluacion.observacion,
    });

    await em.flush();
    return evaluacion;
  }

  async updateBatchEvaluaciones(
    evaluaciones: Array<{ id: number } & Partial<IEvaluacionInput>>,
  ) {
    const em = this.em;
    const updated: Evaluacion[] = [];

    await em.transactional(async (tem) => {
      for (const evalData of evaluaciones) {
        const { id, ...updateData } = evalData;
        const evaluacion = await tem.findOne(Evaluacion, { id });
        if (evaluacion) {
          wrap(evaluacion).assign({
            nota: updateData.nota ?? evaluacion.nota,
            observacion: updateData.observacion ?? evaluacion.observacion,
          });
          updated.push(evaluacion);
        }
      }
    });

    return updated;
  }

  // ========================== DELETE ==========================

  async deleteEvaluacion(id: number) {
    const em = this.em;
    const evaluacion = await em.findOne(Evaluacion, { id });
    if (!evaluacion) return null;

    await em.removeAndFlush(evaluacion);
    return evaluacion;
  }
}

export default new EvaluacionService();
