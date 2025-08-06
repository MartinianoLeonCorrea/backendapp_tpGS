//Este script "seed (semilla)" se utiliza para generar una base de datos inicial con datos predefinidos para la entidad Materia.

const { sequelize } = require('../config/database');
const Materia = require('../models/materia.model');

const materiasIniciales = [
  {
    nombre: 'Matemáticas',
    descripcion: 'Fundamentos de álgebra, cálculo y geometría.',
  },
  {
    nombre: 'Lengua y Literatura',
    descripcion: 'Análisis de textos, gramática y producción de ensayos.',
  },
  {
    nombre: 'Historia',
    descripcion:
      'Estudio de los eventos y procesos del pasado, desde la antigüedad hasta la actualidad.',
  },
  {
    nombre: 'Geografía',
    descripcion:
      'Análisis del espacio geográfico y sus interacciones sociales, económicas y ambientales.',
  },
  {
    nombre: 'Física',
    descripcion:
      'Principios de la mecánica, termodinámica y electromagnetismo.',
  },
  {
    nombre: 'Química',
    descripcion:
      'Estudio de la composición, estructura y propiedades de la materia.',
  },
  {
    nombre: 'Biología',
    descripcion: 'Ciencia que estudia los seres vivos y sus procesos vitales.',
  },
  {
    nombre: 'Educación Física',
    descripcion:
      'Desarrollo de habilidades motrices y promoción de la actividad física.',
  },
  {
    nombre: 'Inglés',
    descripcion:
      'Aprendizaje del idioma inglés, incluyendo gramática, vocabulario y conversación.',
  },
  {
    nombre: 'Educación Artística',
    descripcion:
      'Exploración de la creatividad a través de diversas expresiones artísticas.',
  },
];

async function seedMaterias() {
  await sequelize.sync();
  for (const materia of materiasIniciales) {
    await Materia.findOrCreate({
      where: { nombre: materia.nombre },
      defaults: materia,
    });
  }
  console.log('Materias iniciales insertadas.');
  process.exit();
}

seedMaterias();
