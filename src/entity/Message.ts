import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { Carrier } from "./Carrier";
import { Mailer } from "./Mailer";
import { Phone } from "./embed/Phone";

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Phone)
  phone: Phone;

  @Column()
  text: string;

  @Column({ default: false })
  sent: boolean;

  @ManyToOne(() => Mailer, (mailer: Mailer) => mailer.messages)
  mailer: Mailer;

  @ManyToOne(() => Carrier, (carrier: Carrier) => carrier.messages, {
    nullable: true,
  })
  carrier: Carrier;
}
