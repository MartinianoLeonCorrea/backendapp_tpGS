import {
  Entity,
  PrimaryKey,
  Property,
  OneToOne,
} from "@mikro-orm/core";
import { Persona } from "../persona/persona.entity";

@Entity()
export class User {

  //hay que mover los roles desde persona a user

  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  email!: string;

  @Property()
  dni!: string;

  @Property()
  password!: string;

  @Property({ default: true })
  active!: boolean;

  @OneToOne(() => Persona, { owner: true, nullable: true })
  persona?: Persona;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}

