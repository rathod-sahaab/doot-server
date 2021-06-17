import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
  BaseEntity,
} from "typeorm";
import { CarrierMailer } from "./CarrierMailer";
import { Timestamps } from "./embed/Timestamps";
import { Message } from "./Message";

@Entity()
export class Mailer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @OneToMany(() => Message, (message) => message.mailer)
  messages: Message[];

  @Column(() => Timestamps)
  timestamps: Timestamps;

  @OneToMany(() => CarrierMailer, (cm) => cm.mailer)
  carrierConnection: CarrierMailer[];
}
