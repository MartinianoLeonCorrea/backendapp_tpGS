import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { Curso } from '../curso/curso.entity';
import { Materia } from '../materia/materia.entity';
import { Persona } from '../persona/persona.entity';
import { Examen } from '../examen/examen.entity';

@Entity({ tableName: 'dictados' })
export class Dictado {
  @PrimaryKey()
  id!: number;

  @Property()
  anio!: number;

  @Property({ length: 100, fieldName: 'dias_cursado' })
  diasCursado!: string;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Relaciones (MikroORM crea automáticamente cursoId, materiaId, docenteId)
  @ManyToOne(() => Curso)
  curso!: Curso;

  @ManyToOne(() => Materia)
  materia!: Materia;

  @ManyToOne(() => Persona)
  docente!: Persona;

  @OneToMany(() => Examen, (examen) => examen.dictado)
  examenes = new Collection<Examen>(this);
}