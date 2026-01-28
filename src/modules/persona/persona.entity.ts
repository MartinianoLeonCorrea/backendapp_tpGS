import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Enum } from '@mikro-orm/core';
import { Curso } from '../curso/curso.entity';
import { Dictado } from '../dictado/dictado.entity';
import { Evaluacion } from '../evaluacion/evaluacion.entity';

export enum TipoPersona {
  ALUMNO = 'alumno',
  DOCENTE = 'docente',
}

@Entity({ tableName: 'personas' })
export class Persona {
  @PrimaryKey()
  dni!: number;

  @Property({ length: 100 })
  nombre!: string;

  @Property({ length: 100 })
  apellido!: string;

  @Property({ length: 15 })
  telefono!: string;

  @Property({ length: 255 })
  direccion!: string;

  @Property({ length: 100 })
  email!: string;

  @Enum(() => TipoPersona)
  tipo!: TipoPersona;

  @Property({ length: 100, nullable: true })
  especialidad?: string;

  @Property({ 
    fieldName: 'created_at', 
    onCreate: () => new Date() // Esto asegura el valor en el INSERT
  })
  createdAt: Date = new Date();

  @Property({ 
    fieldName: 'updated_at', 
    onCreate: () => new Date(), // Valor inicial
    onUpdate: () => new Date()  // Valor en cada UPDATE
  })
  updatedAt: Date = new Date();

  // Relaciones (MikroORM crea automáticamente cursoId)
  @ManyToOne(() => Curso, { nullable: true })
  curso?: Curso;

  @OneToMany(() => Dictado, (dictado) => dictado.docente)
  dictados = new Collection<Dictado>(this);

  @OneToMany(() => Evaluacion, (evaluacion) => evaluacion.alumno)
  evaluaciones = new Collection<Evaluacion>(this);
}