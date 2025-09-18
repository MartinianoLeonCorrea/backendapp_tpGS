'use strict';
//Para eliminar datos existentes tenés que ejecutar el comando:
// npx sequelize-cli db:seed:undo:all

//Para que se creen los datos tenés que ejecutar el comando: 
// npx sequelize-cli db:seed:all

//Los seed se ejecutan en una terminal aparte pero en la carpeta del backend

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
          nombre: 'Lengua y Literatura',
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
          nombre: 'Física',
          descripcion: 'Principios de la mecánica, termodinámica y electromagnetismo.',
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
        // ===================== DOCENTES =====================
        {
          dni: 12345678,
          nombre: 'Ana María',
          apellido: 'García López',
          telefono: '341-2345678',
          direccion: 'Ayacucho 123, Rosario',
          email: 'ana.garcia@escuela.edu.ar',
          tipo: 'docente',
          especialidad: 'Matemática',
          curso_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          dni: 23456789,
          nombre: 'Luis Alberto',
          apellido: 'Gómez Ruiz',
          telefono: '341-3456789',
          direccion: 'España 456, Rosario',
          email: 'luis.gomez@escuela.edu.ar',
          tipo: 'docente',
          especialidad: 'Lengua y Literatura',
          curso_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          dni: 34567890,
          nombre: 'Carmen Elena',
          apellido: 'Rodríguez Silva',
          telefono: '341-4567890',
          direccion: 'San Martín 789, Rosario',
          email: 'carmen.rodriguez@escuela.edu.ar',
          tipo: 'docente',
          especialidad: 'Historia',
          curso_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          dni: 45678901,
          nombre: 'Roberto Carlos',
          apellido: 'Fernández Torres',
          telefono: '341-5678901',
          direccion: 'Belgrano 321, Rosario',
          email: 'roberto.fernandez@escuela.edu.ar',
          tipo: 'docente',
          especialidad: 'Física',
          curso_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },

        // ===================== ALUMNOS =====================
        {
          dni: 44123456,
          nombre: 'Martín Alejandro',
          apellido: 'Pérez González',
          telefono: '341-1234567',
          direccion: 'Pellegrini 1230, Rosario',
          email: 'martin.perez@estudiante.edu.ar',
          tipo: 'alumno',
          especialidad: null,
          curso_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          dni: 44234567,
          nombre: 'Sofía Valentina',
          apellido: 'Martínez Díaz',
          telefono: '341-2345678',
          direccion: 'Zeballos 456, Rosario',
          email: 'sofia.martinez@estudiante.edu.ar',
          tipo: 'alumno',
          especialidad: null,
          curso_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          dni: 45123456,
          nombre: 'Nicolás Benjamín',
          apellido: 'Jiménez Vargas',
          telefono: '341-7890123',
          direccion: 'Urquiza 890, Rosario',
          email: 'nicolas.jimenez@estudiante.edu.ar',
          tipo: 'alumno',
          especialidad: null,
          curso_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          dni: 46123456,
          nombre: 'Catalina Luz',
          apellido: 'Morales Gómez',
          telefono: '341-1357924',
          direccion: 'Tucumán 789, Rosario',
          email: 'catalina.morales@estudiante.edu.ar',
          tipo: 'alumno',
          especialidad: null,
          curso_id: 3,
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
        // ========== DICTADOS CURSO 1A ==========
        {
          id: 1,
          anio: 2025,
          dias_cursado: 'Lunes, Miércoles, Viernes',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 1,
          materia_id: 1, // Matemática
          docente_id: 12345678, // Ana García
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          anio: 2025,
          dias_cursado: 'Martes, Jueves',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 1,
          materia_id: 2, // Lengua y Literatura
          docente_id: 23456789, // Luis Gómez
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          anio: 2025,
          dias_cursado: 'Viernes',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 1,
          materia_id: 3, // Historia
          docente_id: 34567890, // Carmen Rodríguez
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          anio: 2025,
          dias_cursado: 'Lunes',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 1,
          materia_id: 4, // Física
          docente_id: 45678901, // Roberto Fernández
          created_at: new Date(),
          updated_at: new Date(),
        },

        // ========== DICTADOS CURSO 1B ==========
        {
          id: 5,
          anio: 2025,
          dias_cursado: 'Martes, Jueves',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 2,
          materia_id: 1, // Matemática
          docente_id: 12345678, // Ana García
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 6,
          anio: 2025,
          dias_cursado: 'Lunes, Miércoles',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 2,
          materia_id: 2, // Lengua y Literatura
          docente_id: 23456789, // Luis Gómez
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 7,
          anio: 2025,
          dias_cursado: 'Viernes',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 2,
          materia_id: 3, // Historia
          docente_id: 34567890, // Carmen Rodríguez
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 8,
          anio: 2025,
          dias_cursado: 'Miércoles',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 2,
          materia_id: 4, // Física
          docente_id: 45678901, // Roberto Fernández
          created_at: new Date(),
          updated_at: new Date(),
        },

        // ========== DICTADOS CURSO 2A ==========
        {
          id: 9,
          anio: 2025,
          dias_cursado: 'Lunes, Viernes',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 3,
          materia_id: 1, // Matemática
          docente_id: 12345678, // Ana García
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 10,
          anio: 2025,
          dias_cursado: 'Martes, Jueves',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 3,
          materia_id: 2, // Lengua y Literatura
          docente_id: 23456789, // Luis Gómez
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 11,
          anio: 2025,
          dias_cursado: 'Miércoles',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 3,
          materia_id: 3, // Historia
          docente_id: 34567890, // Carmen Rodríguez
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 12,
          anio: 2025,
          dias_cursado: 'Martes, Jueves, Viernes',
          notas_alumnos: null,
          asistencias_alumnos: null,
          curso_id: 3,
          materia_id: 4, // Física
          docente_id: 45678901, // Roberto Fernández
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
        // Exámenes Curso 1A
        {
          id: 1,
          fecha_examen: new Date('2025-10-15'),
          temas: 'Operaciones básicas: suma, resta, multiplicación',
          copias: 20,
          dictado_id: 1, // Matemática 1A
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          fecha_examen: new Date('2025-10-22'),
          temas: 'Comprensión lectora y análisis de texto',
          copias: 20,
          dictado_id: 2, // Lengua 1A
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          fecha_examen: new Date('2025-11-05'),
          temas: 'Civilizaciones antiguas: Egipto',
          copias: 20,
          dictado_id: 3, // Historia 1A
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          fecha_examen: new Date('2025-10-30'),
          temas: 'Fuerzas y movimiento básico',
          copias: 20,
          dictado_id: 4, // Física 1A
          created_at: new Date(),
          updated_at: new Date(),
        },
        
        // Exámenes Curso 1B
        {
          id: 5,
          fecha_examen: new Date('2025-11-12'),
          temas: 'Fracciones y decimales',
          copias: 18,
          dictado_id: 5, // Matemática 1B
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 6,
          fecha_examen: new Date('2025-11-18'),
          temas: 'Redacción y ortografía',
          copias: 18,
          dictado_id: 6, // Lengua 1B
          created_at: new Date(),
          updated_at: new Date(),
        },
        
        // Exámenes Curso 2A
        {
          id: 7,
          fecha_examen: new Date('2025-11-25'),
          temas: 'Ecuaciones lineales simples',
          copias: 15,
          dictado_id: 9, // Matemática 2A
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 8,
          fecha_examen: new Date('2025-12-02'),
          temas: 'Cinemática: movimiento rectilíneo uniforme',
          copias: 15,
          dictado_id: 12, // Física 2A
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