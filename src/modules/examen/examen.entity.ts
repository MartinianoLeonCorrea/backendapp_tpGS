import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { Dictado } from '../dictado/dictado.entity';
import { Evaluacion } from '../evaluacion/evaluacion.entity';

@Entity({ tableName: 'examenes' })
export class Examen {
  @PrimaryKey()
  id!: number;

  @Property({ fieldName: 'fecha_examen' })
  fechaExamen!: Date;

  @Property({ type: 'string' })
  temas!: string;

  @Property({ default: 0 })
  copias: number = 0;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Relaciones (MikroORM crea automáticamente dictadoId)
  @ManyToOne(() => Dictado)
  dictado!: Dictado;

  @OneToMany(() => Evaluacion, (evaluacion) => evaluacion.examen)
  evaluaciones = new Collection<Evaluacion>(this);
}