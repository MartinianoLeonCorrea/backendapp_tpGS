import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  Enum,
} from '@mikro-orm/core';
import { Persona } from '../persona/persona.entity';
import { Dictado } from '../dictado/dictado.entity';

export enum Turno {
  MANANA = 'MAÑANA',
  TARDE = 'TARDE',
  NOCHE = 'NOCHE',
}

@Entity({ tableName: 'cursos' })
export class Curso {
  @PrimaryKey()
  id!: number;

  @Property({ fieldName: 'nro_letra', length: 3 })
  nroLetra!: string;

  @Enum(() => Turno)
  turno!: Turno;

  @Property({
    fieldName: 'created_at',
    onCreate: () => new Date(),
  })
  createdAt?: Date;

  @Property({
    fieldName: 'updated_at',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt?: Date;

  @OneToMany(() => Persona, (persona) => persona.curso)
  alumnos = new Collection<Persona>(this);

  @OneToMany(() => Dictado, (dictado) => dictado.curso)
  dictados = new Collection<Dictado>(this);
}
