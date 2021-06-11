import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { Timestamps } from "./embed/Timestamps";
import {User} from "./embed/User";
import { Message } from "./Message";

@Entity()
export class Mailer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => User)
  user: User;

  @OneToMany(() => Message, (message) => message.mailer)
  messages: Message[];

  @Column(() => Timestamps)
  timestamps: Timestamps;
}
