import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import dotenv from 'dotenv';

dotenv.config();

const config: Options = {
  driver: MySqlDriver,
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  
  // Directorio de entidades (busca en modules)
  entities: ['./dist/modules/**/*.entity.js'],
  entitiesTs: ['./src/modules/**/*.entity.ts'],
  
  // Migraciones
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
  
  // Configuración general
  debug: process.env.NODE_ENV === 'development',
  allowGlobalContext: true, // Para Request Context
  
  // Naming strategy (snake_case como en Sequelize)
  namingStrategy: undefined, // Usa el default que maneja snake_case
  
  // Pool de conexiones
  pool: {
    min: 0,
    max: 5,
  },
};

export default config;