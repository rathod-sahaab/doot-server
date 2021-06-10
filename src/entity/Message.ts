import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Carrier } from "./Carrier";
import { Mailer } from "./Mailers";
import { Phone } from "./embed/Phone";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Phone)
  phone: Phone;

  @Column()
  text: string;

  @Column({default: false})
  sent: boolean;

  @ManyToOne(() => Mailer, (mailer: Mailer) => mailer.messages, {
    nullable: true,
  })
  mailer: Mailer;

  @ManyToOne(() => Carrier, (carrier: Carrier) => carrier.messages, {
    nullable: true,
  })
  carrier: Carrier;
}
