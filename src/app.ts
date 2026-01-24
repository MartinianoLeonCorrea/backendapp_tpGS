// Configuración Express, middlewares y rutas.
import express, { Application } from 'express';
import cors from 'cors';

// Importar middlewares
import { notFound } from './middleware/notFound';
import errorHandler from './middleware/errorHandler';

// Importar rutas
import materiaRoutes from './modules/materia/materia.routes';
// import cursoRoutes from './modules/curso/curso.routes';
// import personaRoutes from './modules/persona/persona.routes';
// import dictadoRoutes from './modules/dictado/dictado.routes';
import examenRoutes from './modules/examen/examen.routes';
// import evaluacionRoutes from './modules/evaluacion/evaluacion.routes';

// Crea instancia de Express
const app: Application = express();

// Middlewares base
app.use(cors());
app.use(express.json());

// Usar las rutas
app.use('/api/materias', materiaRoutes);
// app.use('/api/cursos', cursoRoutes);
// app.use('/api/personas', personaRoutes);
// app.use('/api/dictados', dictadoRoutes);
app.use('/api/examenes', examenRoutes);
// app.use('/api/evaluaciones', evaluacionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Gestión Tu Secundaria corriendo en el backend');
});

// Middlewares finales
app.use(notFound); // Manejo del 404
app.use(errorHandler); // Manejo global de errores

export default app;