import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { Dictado } from '../dictado/dictado.entity';
import { Evaluacion } from '../evaluacion/evaluacion.entity';

@Entity({ tableName: 'examenes' })
export class Examen {
  @PrimaryKey()
  id!: number;

  @Property({ fieldName: 'fecha_examen' })
  fechaExamen!: Date;

  @Property({ type: 'text' })
  temas!: string;

  @Property({ default: 0 })
  copias: number = 0;

  @Property({ fieldName: 'created_at', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => Dictado, { fieldName: 'dictado_id' })
  dictado!: Dictado;

  @OneToMany(() => Evaluacion, (evaluacion) => evaluacion.examen)
  evaluaciones = new Collection<Evaluacion>(this);
}