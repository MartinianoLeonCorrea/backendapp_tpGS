import { MikroORM, Options } from '@mikro-orm/core';
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
  entities: ['./dist/modules/**/*.entity.js'],
  entitiesTs: ['./src/modules/**/*.entity.ts'],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
  seeder: {
    path: './dist/seeders',
    pathTs: './src/seeders',
    defaultSeeder: 'DemoSeeder',
    glob: '!(*.d).{js,ts}',
  },
  debug: process.env.NODE_ENV === 'development',
  allowGlobalContext: true,
  pool: { min: 0, max: 5 },
};

// Exportamos la configuración por defecto para la CLI
export default config;

// Exportamos una función para inicializar el ORM en app.ts
export const initORM = async () => {
  return await MikroORM.init(config);
};