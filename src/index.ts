// Carga de las variables de entorno e inicialización de Express.

import dotenv from 'dotenv';
import app from './app';
import { initORM, closeORM } from './config/mikro-orm';

// Cargar variables de entorno al inicio
dotenv.config();

// Usar el puerto de .env con valor por defecto
const port: number = parseInt(process.env.PORT || '3000', 10);

// Inicializar MikroORM y luego iniciar el servidor
async function bootstrap() {
  try {
    // Inicializar MikroORM
    await initORM();
    
    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Aplicación corriendo en el puerto: ${port}`);
    });
  } catch (err) {
    console.error('Error al inicializar la aplicación:', err);
    process.exit(1);
  }
}

// Manejar cierre graceful
process.on('SIGINT', async () => {
  console.log('\n⏳ Cerrando aplicación...');
  await closeORM();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏳ Cerrando aplicación...');
  await closeORM();
  process.exit(0);
});

// Ejecutar
bootstrap();