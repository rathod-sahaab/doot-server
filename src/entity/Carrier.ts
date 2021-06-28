import { Field, ID, ObjectType } from "type-graphql";
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

@ObjectType()
@Entity()
export class Carrier extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: "integer", default: 0 })
  count: number;

  /**
   * Stores the messages sent by the carrier
   */
  @OneToMany(() => Message, (message: Message) => message.carrier)
  messages: Message[];

  @OneToMany(() => CarrierMailer, (cm) => cm.carrier)
  mailerConnection: CarrierMailer[];

  @Column(() => Timestamps)
  timestamps: Timestamps;
}
