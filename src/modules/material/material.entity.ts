import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { Dictado } from '../dictado/dictado.entity';

export enum TipoMaterial {
  PDF = 'pdf',
  VIDEO = 'video',
  LINK = 'link',
  OTRO = 'otro',
}

@Entity({ tableName: 'materiales' })
export class Material {
  @PrimaryKey()
  id!: number;

  @Property({ length: 150 })
  titulo!: string;

  @Property({ type: 'text', nullable: true })
  descripcion?: string;

  @Property({ length: 500 })
  url!: string;

  @Enum(() => TipoMaterial)
  tipo!: TipoMaterial;

  @Property({ fieldName: 'created_at', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => Dictado)
  dictado!: Dictado;
}