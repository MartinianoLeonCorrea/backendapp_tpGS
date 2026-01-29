import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
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

  @Property({ fieldName: 'dias_cursado', length: 100 })
  diasCursado!: string;

  @Property({ fieldName: 'fecha_desde', nullable: true })
  fechaDesde?: Date;

  @Property({ fieldName: 'fecha_hasta', nullable: true })
  fechaHasta?: Date;

  @Property({
    fieldName: 'created_at',
    onCreate: () => new Date(),
  })
  createdAt: Date = new Date();

  @Property({
    fieldName: 'updated_at',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();

  @ManyToOne(() => Curso)
  curso!: Curso;

  @ManyToOne(() => Materia)
  materia!: Materia;

  @ManyToOne(() => Persona)
  docente!: Persona;

  @OneToMany(() => Examen, (examen) => examen.dictado)
  examenes = new Collection<Examen>(this);
}
