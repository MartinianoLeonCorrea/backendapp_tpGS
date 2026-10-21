import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Dictado } from '../dictado/dictado.entity';
import { Persona } from '../persona/persona.entity';

@Entity({ tableName: 'foro_mensajes' })
export class ForoMensaje {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  texto!: string;

  @Property({ fieldName: 'created_at', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @ManyToOne(() => Dictado, { deleteRule: 'cascade' })
  dictado!: Dictado;

  @ManyToOne(() => Persona)
  autor!: Persona;
}
