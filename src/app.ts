import express, { Application } from 'express';
import cors from 'cors';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import config from './config/mikro-orm.config';

// Importar middlewares
import { notFound } from './middleware/notFound';
import errorHandler from './middleware/errorHandler';

// Importar rutas
import materiaRoutes from './modules/materia/materia.routes';
import examenRoutes from './modules/examen/examen.routes';
// import cursoRoutes from './modules/curso/curso.routes';
import personaRoutes from './modules/persona/persona.routes';
// import dictadoRoutes from './modules/dictado/dictado.routes';
// import evaluacionRoutes from './modules/evaluacion/evaluacion.routes';

const app: Application = express();

// Instancia global del ORM para usar en el middleware
export let orm: MikroORM;

// Función para inicializar la conexión (se llama desde server.ts o al inicio)
export const initORM = async () => {
  orm = await MikroORM.init(config);
  console.log('✅ MikroORM conectado exitosamente');
  return orm;
};

// --- Middlewares base ---
app.use(cors());
app.use(express.json());

// ⚠️ MIDDLEWARE CRÍTICO: RequestContext para MikroORM
// Esto permite que 'req.em' funcione en tus controladores
app.use((req, res, next) => {
  if (orm) {
    RequestContext.create(orm.em, next);
  } else {
    next();
  }
});

// --- Rutas de la API ---
app.use('/api/materias', materiaRoutes);
app.use('/api/examenes', examenRoutes);

// Rutas comentadas para habilitar tras migración
// app.use('/api/cursos', cursoRoutes);
app.use('/api/personas', personaRoutes);
// app.use('/api/dictados', dictadoRoutes);
// app.use('/api/evaluaciones', evaluacionRoutes);

// Ruta de prueba inicial
app.get('/', (req, res) => {
  res.send('API de Gestión Tu Secundaria corriendo en el backend con MikroORM');
});

// --- Middlewares de error ---
app.use(notFound); // Manejo del 404
app.use(errorHandler); // Manejo de errores globales

export default app;