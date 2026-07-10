import { EntityManager, RequestContext } from '@mikro-orm/core';
import { User } from './user.entity';
import { TipoPersona } from '../persona/persona.entity';
import { RequiredEntityData } from '@mikro-orm/core';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';

export class UserService {
  private get em(): EntityManager {
    return RequestContext.getEntityManager() as EntityManager;
  }

  private toPublicUser(user: User) {
    const { password, ...publicUser } = user as any;
    return publicUser;
  }
  // GENERADOR DE LEGAJOS
  async generarLegajoAutoincremental(tipo: TipoPersona): Promise<string> {
    const year = new Date().getFullYear();
    const prefijoAnio = year.toString().slice(-2);

    const ultimoUsuario = await this.em.findOne(
      User,
      {
        persona: { tipo: tipo },
        legajo: { $like: `${prefijoAnio}%` }, // Busca los de este año
      },
      { orderBy: { legajo: 'DESC' } },
    );

    let siguienteNumero = 1;
    if (ultimoUsuario && ultimoUsuario.legajo) {
      const numeroSecuenciaStr = ultimoUsuario.legajo.substring(2);
      siguienteNumero = parseInt(numeroSecuenciaStr, 10) + 1;
    }

    // AANNN para alumnos (5 dígitos), AANN para docentes (4 dígitos)
    if (tipo === TipoPersona.ALUMNO) {
      return `${prefijoAnio}${siguienteNumero.toString().padStart(3, '0')}`;
    } else {
      return `${prefijoAnio}${siguienteNumero.toString().padStart(2, '0')}`;
    }
  }

  // LOGIN ACTUALIZADO
  async login(usuarioIdentificador: string, contrasenaPlana: string) {
    let user: User | null = null;

    if (usuarioIdentificador.includes('@')) {
      // Búsqueda por email
      user = await this.em.findOne(
        User,
        { persona: { email: usuarioIdentificador } },
        { populate: ['persona'] },
      );
    } else {
      // Búsqueda por legajo (ahora es un string)
      user = await this.em.findOne(
        User,
        { legajo: usuarioIdentificador },
        { populate: ['persona'] },
      );
    }

    if (!user) throw new Error('Credenciales inválidas');

    const valid = await bcrypt.compare(contrasenaPlana, user.password);
    if (!valid) throw new Error('Credenciales inválidas');

    // Firmamos el token con la info que necesita tu frontend
    const token = generateToken({
      userId: user.id,
      legajo: user.legajo,
      email: user.persona.email,
    });

    return { user: this.toPublicUser(user), token };
  }
  createUser = async (userData: RequiredEntityData<User>) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.em.create(User, {
      ...userData,
      password: hashedPassword,
    });
    await this.em.persistAndFlush(user);
    return this.toPublicUser(user);
  };

  async findAll() {
    const users = await this.em.find(User, {}, { populate: ['persona'] });
    return users.map((user) => this.toPublicUser(user));
  }
}
