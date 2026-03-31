import { EntityManager } from '@mikro-orm/core';
import { RequestContext } from '@mikro-orm/core';
import { User } from './user.entity';
import { RequiredEntityData } from '@mikro-orm/core';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export class UserService {

  private get em(): EntityManager {
    return RequestContext.getEntityManager() as EntityManager;
  }

  async findByEmail(email: string) {
    return this.em.findOne(User, { email });
  }

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (!user) throw new Error('Usuario no existe');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Password incorrecta');

    const token = jwt.sign(
      { userId: user.id },
      'SECRET_KEY',
      { expiresIn: '1h' }
    );

    return { user, token };
  }

  async findAll() {
    return await this.em.find(User, {});
  }

  async createUser(data: RequiredEntityData<User>) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.em.create(User, {
      ...data,
      password: hashedPassword,
    });

    await this.em.persistAndFlush(user);
    return user;
  }
}