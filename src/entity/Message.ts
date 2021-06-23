import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from "typeorm";
import { Carrier } from "./Carrier";
import { Mailer } from "./Mailer";
import { Phone } from "./embed/Phone";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Message extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column(() => Phone)
  phone: Phone;

  @Field()
  @Column()
  text: string;

  @Field()
  @Column({ default: false })
  sent: boolean;

  @Column()
  mailerId: number;

  @Column({ nullable: true })
  carrierId: number;

  @Field()
  @ManyToOne(() => Mailer, (mailer: Mailer) => mailer.messages)
  @JoinColumn({ name: "mailerId" })
  mailer: Mailer;

  @ManyToOne(() => Carrier, (carrier: Carrier) => carrier.messages, {
    nullable: true,
  })
  @JoinColumn({ name: "carrierId" })
  carrier: Carrier;
}
