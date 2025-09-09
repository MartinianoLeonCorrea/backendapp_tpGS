'use strict';
//Para que se creen tenes que ejecutar el comando: npx sequelize-cli db:seed:all
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Cursos
    await queryInterface.bulkInsert(
      'cursos',
      [
        {
          id: 1,
          nro_letra: '1A',
          turno: 'MAÑANA',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          nro_letra: '1B',
          turno: 'TARDE',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          nro_letra: '2A',
          turno: 'MAÑANA',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          nro_letra: '2B',
          turno: 'TARDE',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 5,
          nro_letra: '3A',
          turno: 'MAÑANA',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 6,
          nro_letra: '3B',
          turno: 'TARDE',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    // 2. Materias
    await queryInterface.bulkInsert(
      'materias',
      [
        {
          id: 1,
          nombre: 'Matemática',
          descripcion: 'Números y Fundamentos de álgebra, cálculo y geometría.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          nombre: 'Lengua y literatura',
          descripcion: 'Análisis de textos, gramática y producción de ensayos.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          nombre: 'Historia',
          descripcion: 'Estudio de eventos, sociedades y culturas pasadas.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          nombre: 'Geografía',
          descripcion:
            'Análisis del espacio geográfico y sus interacciones sociales, económicas y ambientales.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 5,
          nombre: 'Física',
          descripcion:
            'Principios de la mecánica, termodinámica y electromagnetismo.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 6,
          nombre: 'Química',
          descripcion:
            'Estudio de la composición, estructura y propiedades de la materia.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 7,
          nombre: 'Biología',
          descripcion:
            'Ciencia que estudia los seres vivos y sus procesos vitales.',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    // 3. Personas (alumnos y docentes)
    await queryInterface.bulkInsert(
      'personas',
      [
        // Docentes
        {
          dni: 10000001,
          nombre: 'Ana',
          apellido: 'García',
          telefono: '123456789',
          direccion: 'Ayacucho 123',
          email: 'ana@escuela.com',
          tipo: 'docente',
          especialidad: 'Matemática',
          curso_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          dni: 10000002,
          nombre: 'Luis',
          apellido: 'Gomez',
          telefono: '987654321',
          direccion: 'España 456',
          email: 'luis@escuela.com',
          tipo: 'docente',
          especialidad: 'Lengua',
          curso_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Alumnos
        {
          dni: 20000001,
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '555555555',
          direccion: 'Pellegrini 1230',
          email: 'juan@escuela.com',
          tipo: 'alumno',
          especialidad: null,
          curso_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          dni: 20000002,
          nombre: 'María',
          apellido: 'Martínez',
          telefono: '444444444',
          direccion: 'Zeballos 456',
          email: 'maria@escuela.com',
          tipo: 'alumno',
          especialidad: null,
          curso_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          dni: 20000003,
          nombre: 'Carlos',
          apellido: 'Martinez',
          telefono: '333333333',
          direccion: 'San Martín 789',
          email: 'carlos@escuela.com',
          tipo: 'alumno',
          especialidad: null,
          curso_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          dni: 20000004,
          nombre: 'Lucía',
          apellido: 'Fernández',
          telefono: '222222222',
          direccion: 'Belgrano 101',
          email: 'lucia@escuela.com',
          tipo: 'alumno',
          especialidad: null,
          curso_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    // 4. Dictados (referencian curso, materia y docente)
    await queryInterface.bulkInsert(
      'dictados',
      [
        {
          id: 1,
          anio: 2025,
          dias_cursado: 'Lunes, Miércoles',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 1,
          materia_id: 1,
          docente_id: 10000001,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          anio: 2025,
          dias_cursado: 'Martes, Jueves',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 2,
          materia_id: 2,
          docente_id: 10000002,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    // 5. Exámenes (referencian dictado)
    await queryInterface.bulkInsert(
      'examenes',
      [
        {
          id: 1,
          fecha_examen: new Date(),
          temas: 'Sumas y restas',
          copias: 20,
          dictado_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          fecha_examen: new Date(),
          temas: 'Lectura comprensiva',
          copias: 18,
          dictado_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('examenes', null, {});
    await queryInterface.bulkDelete('dictados', null, {});
    await queryInterface.bulkDelete('personas', null, {});
    await queryInterface.bulkDelete('materias', null, {});
    await queryInterface.bulkDelete('cursos', null, {});
  },
};
