import { MikroORM, RequestContext } from '@mikro-orm/core';
import config from './mikro-orm.config';

export let orm: MikroORM;

/**
 * Inicializa la conexión a la base de datos con MikroORM
 */
export async function initORM(): Promise<MikroORM> {
  if (!orm) {
    orm = await MikroORM.init(config);
    console.log('✅ MikroORM conectado a la base de datos correctamente.');
  }
  return orm;
}

/**
 * Cierra la conexión a la base de datos
 */
export async function closeORM(): Promise<void> {
  if (orm) {
    await orm.close(true);
    console.log('🔌 Conexión a la base de datos cerrada.');
  }
}

/**
 * Middleware para Request Context
 * Esto es necesario para que MikroORM maneje correctamente las transacciones
 */
export function requestContextMiddleware() {
  return (req: any, res: any, next: any) => {
    RequestContext.create(orm.em, () => {
      req.em = orm.em.fork();
      next();
    });
  };
}
