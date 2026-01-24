import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Examen } from '../examen/examen.entity';
import { Persona } from '../persona/persona.entity';

@Entity({ tableName: 'evaluaciones' })
export class Evaluacion {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'float' })
  nota!: number;

  @Property({ type: 'string', nullable: true })
  observacion?: string;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Relaciones (MikroORM crea automáticamente examenId y alumnoId)
  @ManyToOne(() => Examen)
  examen!: Examen;

  @ManyToOne(() => Persona)
  alumno!: Persona;
}