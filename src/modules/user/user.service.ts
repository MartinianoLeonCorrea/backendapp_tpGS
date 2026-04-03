import { EntityManager } from '@mikro-orm/core';
import { RequestContext } from '@mikro-orm/core';
import { User } from './user.entity';
import { RequiredEntityData } from '@mikro-orm/core';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';


export class UserService {

  private get em(): EntityManager {
    return RequestContext.getEntityManager() as EntityManager;
  }

  async findByEmail(email: string) {
    return this.em.findOne(User, { email });
  }

  private toPublicUser(user: User) {
    const { password, ...publicUser } = user as User & { password?: string };
    return publicUser;
  }

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (!user) throw new Error('Usuario no existe');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Password incorrecta');

    const token = generateToken({
      userId: user.id,
      email: user.email,
      dni: user.dni,
    });

    return { user: this.toPublicUser(user), token };
  }

  async findAll() {
    const users = await this.em.find(User, {});
    return users.map((user) => this.toPublicUser(user));
  }

  async createUser(data: RequiredEntityData<User>) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.em.create(User, {
      ...data,
      password: hashedPassword,
    });

    await this.em.persistAndFlush(user);
    return this.toPublicUser(user);
  }
}