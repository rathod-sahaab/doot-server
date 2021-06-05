import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Message } from "./Message";

@Entity()
export class Mailer {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Message, (message) => message.mailer)
  messages: Message[];
}
