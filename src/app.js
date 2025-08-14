// Configuración Express, middlewares y rutas.

const express = require('express');
const app = express();

// Middleware para parsear el body de las request como JSON
app.use(express.json());

// Middlewares de ejemplo (mostrar las peticiones que llegan, cuando y de qué tipo)
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

// Importar rutas 
const materiaRoutes = require('./modules/materia/materia.routes');
const cursoRoutes = require('./modules/curso/curso.routes');
const personaRoutes = require('./modules/persona/persona.routes');

// Usar las rutas
app.use('/api/materias', materiaRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/personas', personaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Gestión Tu Secundaria corriendo en el backend');
});

// Middleware para manejar rutas no encontradas (Error 404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack); // Loguear el error para depuración
  res
    .status(500)
    .json({ message: 'Algo salió mal en el servidor', error: err.message });
});

module.exports = app;
