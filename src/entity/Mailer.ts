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
export class Mailer extends BaseEntity {
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

  // @Field(() => Message)
  @OneToMany(() => Message, (message) => message.mailer)
  messages: Message[];

  @Column(() => Timestamps)
  timestamps: Timestamps;

  @OneToMany(() => CarrierMailer, (cm) => cm.mailer)
  carrierConnection: CarrierMailer[];
}
