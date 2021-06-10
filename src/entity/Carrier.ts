import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { Timestamps } from "./embed/Timestamps";
import { Message } from "./Message";

@Entity()
export class Carrier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @OneToMany(() => Message, (message: Message) => message.carrier)
  messages: Message[];

  @Column(() => Timestamps)
  timestamps: Timestamps;
}
