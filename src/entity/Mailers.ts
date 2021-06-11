import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { Timestamps } from "./embed/Timestamps";
import { Message } from "./Message";

@Entity()
export class Mailer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  username: string;

  @OneToMany(() => Message, (message) => message.mailer)
  messages: Message[];

  @Column(() => Timestamps)
  timestamps: Timestamps;
}
