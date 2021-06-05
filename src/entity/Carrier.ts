import { Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Message } from "./Message";

@Entity()
export class Carrier {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Message, (message: Message) => message.carrier)
  messages: Message[];
}
