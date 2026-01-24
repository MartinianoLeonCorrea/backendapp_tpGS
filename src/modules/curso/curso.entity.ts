import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Persona } from '../persona/persona.entity';
import { Dictado } from '../dictado/dictado.entity';

@Entity({ tableName: 'cursos' })
export class Curso {
  @PrimaryKey()
  id!: number;

  @Property({ length: 3, fieldName: 'nro_letra' })
  nroLetra!: string;

  @Property({ length: 10 })
  turno!: 'MAÑANA' | 'TARDE' | 'NOCHE';

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Relaciones
  @OneToMany(() => Persona, (persona) => persona.curso)
  alumnos = new Collection<Persona>(this);

  @OneToMany(() => Dictado, (dictado) => dictado.curso)
  dictados = new Collection<Dictado>(this);
}