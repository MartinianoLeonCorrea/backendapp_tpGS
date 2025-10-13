// Configuración Express, middlewares y rutas.
const express = require('express');
const cors = require('cors');

//Importar middlewares
const { notFound } = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Crea instancia de Express
const app = express();

// Midlewares base
app.use(cors());
app.use(express.json());

// Importar rutas
const materiaRoutes = require('./modules/materia/materia.routes');
const cursoRoutes = require('./modules/curso/curso.routes');
const personaRoutes = require('./modules/persona/persona.routes');
const dictadoRoutes = require('./modules/dictado/dictado.routes');
const examenRoutes = require('./modules/examen/examen.routes');
const evaluacionRoutes = require('./modules/evaluacion/evaluacion.routes');

// Usar las rutas
app.use('/api/materias', materiaRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/dictados', dictadoRoutes);
app.use('/api/examenes', examenRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Gestión Tu Secundaria corriendo en el backend');
});

//Midlewares finales
app.use(notFound); //Manejo del 404
app.use(errorHandler); //Manejo global de errores
module.exports = app;
