import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Dictado } from '../dictado/dictado.entity';

@Entity({ tableName: 'materias' })
export class Materia {
  @PrimaryKey()
  id!: number;

  @Property({ length: 100, unique: true })
  nombre!: string;

  @Property({ type: 'text', nullable: true })
  descripcion?: string;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Relaciones
  @OneToMany(() => Dictado, (dictado) => dictado.materia)
  dictados = new Collection<Dictado>(this);
}