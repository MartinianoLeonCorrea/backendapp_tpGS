// Configuración Express, middlewares y rutas.

const express = require('express');
const app = express();

// Middleware para servir archivos estáticos (ajusta la ruta según tu estructura final)
// Si el frontend se sirve por separado, este middleware no será necesario en producción.
app.use(express.static('../frontendapp_tpGS'));

// Middleware para parsear el body de las request como JSON
app.use(express.json());

// Middlewares de ejemplo (puedes eliminarlos o modificarlos según necesites)
app.use((req, res, next) => {
    console.log('Middleware Global: Petición recibida');
    next();
});

// Importar rutas (aquí es donde conectarás tus módulos de rutas)
const materiaRoutes = require('./routes/materia.routes');
// ... importa otras rutas según tus CRUDs

// Usar las rutas
app.use('/api/materias', materiaRoutes);
// ... usa otras rutas

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Gestión Escolar');
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack); // Loguear el error para depuración
    res.status(500).json({ message: 'Algo salió mal en el servidor', error: err.message });
});

module.exports = app;