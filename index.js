// Carga de las variables de entorno e inicialización de Express.

require('dotenv').config(); // Cargar variables de entorno al inicio
const app = require('./src/app'); // Importar la configuración de tu aplicación Express
const { sequelize } = require('./src/config/database'); // Importar la instancia de Sequelize
const port = process.env.PORT; // Usar el puerto de .env

// Sincronizar la base de datos y luego iniciar el servidor

sequelize.sync({ force: false }) 
    .then(() => {
        console.log('Base de datos sincronizada correctamente.');
        app.listen(port, () => {
            console.log(`Aplicación corriendo en el puerto: ${port}`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });
