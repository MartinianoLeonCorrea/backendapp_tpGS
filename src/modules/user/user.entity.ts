import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import { Persona } from '../persona/persona.entity';

@Entity({ tableName: 'users' })
export class User {
  //hay que mover los roles desde persona a user
  //el id va a ser el legajo
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ unique: true, nullable: true })
  legajo?: string;

  @Property()
  password!: string;

  @Property({ default: true })
  active!: boolean;

  @OneToOne(() => Persona, { owner: true, deleteRule: 'cascade' })
  persona!: Persona;

  @Property({ onCreate: () => new Date(), fieldName: 'created_at' })
  createdAt: Date = new Date();
}
