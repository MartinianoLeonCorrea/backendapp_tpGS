import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Persona, TipoPersona } from '../modules/persona/persona.entity';
import { Materia } from '../modules/materia/materia.entity';
import { Curso } from '../modules/curso/curso.entity';

/**
 * COMANDOS DE EJECUCIÓN (Desde la raíz del backend):
 * * 1. Para crear las tablas (si no existen):
 * $env:MIKRO_ORM_ALLOW_TS="true"; npx mikro-orm schema:update --run --config ./src/config/mikro-orm.config.ts
 * * 2. Para cargar estos datos:
 * npm run seed
 */

export class DemoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const ahora = new Date();

    // ==========================================================
    // 1. CURSOS
    // ==========================================================
    const curso1A = em.create(Curso, {
      id: 1,
      nroLetra: '1A',
      turno: 'MAÑANA' as any,
      createdAt: ahora,
      updatedAt: ahora,
    });

    const curso1B = em.create(Curso, {
      id: 2,
      nroLetra: '1B',
      turno: 'TARDE' as any,
      createdAt: ahora,
      updatedAt: ahora,
    });

    const curso2A = em.create(Curso, {
      id: 3,
      nroLetra: '2A',
      turno: 'MAÑANA' as any,
      createdAt: ahora,
      updatedAt: ahora,
    });

    // ==========================================================
    // 2. MATERIAS
    // ==========================================================
    const matMatematica = em.create(Materia, {
      id: 1,
      nombre: 'Matemática',
      descripcion: 'Cálculo, álgebra y geometría básica.',
      createdAt: ahora,
      updatedAt: ahora,
    });

    const matLengua = em.create(Materia, {
      id: 2,
      nombre: 'Lengua y Literatura',
      descripcion: 'Análisis de textos, gramática y ortografía.',
      createdAt: ahora,
      updatedAt: ahora,
    });

    const matHistoria = em.create(Materia, {
      id: 3,
      nombre: 'Historia',
      descripcion: 'Historia nacional y mundial contemporánea.',
      createdAt: ahora,
      updatedAt: ahora,
    });

    // ==========================================================
    // 3. PERSONAS (ALUMNOS Y DOCENTES)
    // ==========================================================
    
    // Docente
    em.create(Persona, {
      dni: 20123456,
      nombre: 'Juan',
      apellido: 'González',
      telefono: '1122334455',
      direccion: 'Calle Falsa 123',
      email: 'juan.gonzalez@escuela.edu.ar',
      tipo: TipoPersona.DOCENTE,
      especialidad: 'Matemática y Física',
      createdAt: ahora,
      updatedAt: ahora,
    });

    // Alumnos
    em.create(Persona, {
      dni: 44123456,
      nombre: 'Martin',
      apellido: 'Pérez',
      telefono: '1133445566',
      direccion: 'Av. Siempre Viva 742',
      email: 'martin.perez@alumno.edu.ar',
      tipo: TipoPersona.ALUMNO,
      curso: curso1A,
      createdAt: ahora,
      updatedAt: ahora,
    });

    em.create(Persona, {
      dni: 44234567,
      nombre: 'Sofía',
      apellido: 'Martínez',
      telefono: '1144556677',
      direccion: 'Paseo de la Reforma 500',
      email: 'sofia.martinez@alumno.edu.ar',
      tipo: TipoPersona.ALUMNO,
      curso: curso1A,
      createdAt: ahora,
      updatedAt: ahora,
    });

    // Guardar todo
    await em.flush();
    
    console.log('✅ Seed finalizado exitosamente: Datos de prueba creados.');
  }
}