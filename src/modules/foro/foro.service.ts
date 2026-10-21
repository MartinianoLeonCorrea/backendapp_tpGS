import { EntityManager } from '@mikro-orm/core';
import { orm } from '../../config/mikro-orm';
import { User } from '../user/user.entity';
import { Dictado } from '../dictado/dictado.entity';
import { ForoMensaje } from './foro.entity';
import { Persona } from '../persona/persona.entity';

class ForoService {
  private get em(): EntityManager {
    return orm.em.fork();
  }

  private async getContext(userId: number, dictadoId: number) {
    const em = this.em;
    const user = await em.findOne(
      User,
      { id: userId },
      { populate: ['persona', 'persona.curso'] },
    );
    const dictado = await em.findOne(
      Dictado,
      { id: dictadoId },
      { populate: ['curso', 'curso.alumnos', 'docente'] },
    );

    if (!user?.persona || !dictado) return null;

    const persona = user.persona;
    const esDocente = dictado.docente.dni === persona.dni;
    const esAlumno = persona.curso?.id === dictado.curso.id;

    if (!esDocente && !esAlumno) return null;
    return { em, dictado, persona };
  }

  async getMensajes(userId: number, dictadoId: number) {
    const context = await this.getContext(userId, dictadoId);
    if (!context) return null;

    const mensajes = await context.em.find(
      ForoMensaje,
      { dictado: dictadoId },
      { populate: ['autor'], orderBy: { createdAt: 'ASC', id: 'ASC' } },
    );

    return mensajes.map((mensaje) => ({
      id: mensaje.id,
      texto: mensaje.texto,
      createdAt: mensaje.createdAt,
      autor: {
        dni: mensaje.autor.dni,
        nombre: mensaje.autor.nombre,
        apellido: mensaje.autor.apellido,
        tipo: mensaje.autor.tipo,
      },
    }));
  }

  async createMensaje(userId: number, dictadoId: number, texto: string) {
    const context = await this.getContext(userId, dictadoId);
    if (!context) return null;

    const mensaje = context.em.create(ForoMensaje, {
      texto: texto.trim(),
      createdAt: new Date(),
      dictado: context.dictado,
      autor: context.persona as Persona,
    });
    await context.em.persistAndFlush(mensaje);

    return {
      id: mensaje.id,
      texto: mensaje.texto,
      createdAt: mensaje.createdAt,
      autor: {
        dni: context.persona.dni,
        nombre: context.persona.nombre,
        apellido: context.persona.apellido,
        tipo: context.persona.tipo,
      },
    };
  }
}

export default new ForoService();
