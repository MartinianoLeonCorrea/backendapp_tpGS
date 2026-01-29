import { EntityManager } from '@mikro-orm/mysql';

declare global {
  namespace Express {
    interface Request {
      em: EntityManager;
    }
  }
}

export { };