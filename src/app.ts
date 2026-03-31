import express, { Application } from 'express';
import cors from 'cors';
import { requestContextMiddleware } from './config/mikro-orm';

// Middlewares
import { notFound } from './middleware/notFound';
import errorHandler from './middleware/errorHandler';

// Rutas
import materiaRoutes from './modules/materia/materia.routes';
import examenRoutes from './modules/examen/examen.routes';
import cursoRoutes from './modules/curso/curso.routes';
import personaRoutes from './modules/persona/persona.routes';
import dictadoRoutes from './modules/dictado/dictado.routes';
import evaluacionRoutes from './modules/evaluacion/evaluacion.routes';
import userRoutes from './modules/user/user.routes';

const app: Application = express();

// --- Middlewares base ---
app.use(cors());
app.use(express.json());

// 🔥 IMPORTANTE: esto va ANTES de las rutas
app.use(requestContextMiddleware());

// --- Rutas de la API ---
app.use('/api/materias', materiaRoutes);
app.use('/api/examenes', examenRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/dictados', dictadoRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);
app.use('/users', userRoutes);
app.use('/api/auth', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Gestión Secundaria funcionando 🚀');
});

// --- Manejo de errores (SIEMPRE al final) ---
app.use(notFound);
app.use(errorHandler);

export default app;