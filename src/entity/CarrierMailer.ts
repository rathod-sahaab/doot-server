import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Carrier } from "./Carrier";
import { Mailer } from "./Mailer";

/**
 * Keeps track of relation between carrier and mailer
 * Think something like facebook's friend requests
 */
export enum CarrierMailerRelation {
  /**
   * Carrier wants to add mailer
   */
  REQUEST_BY_CARRIER = "RBC",
  /**
   * Mailer wants to add carrier
   */
  REQUEST_BY_MAILER = "RBM",
  /**
   * Connection eshtablished
   */
  CONNECTED = "C",
  /**
   * Carrier has been blocked by mailer
   */
  CARRIER_BLOCKED = "CB",
  /**
   * Mailer has been blocked by carrier
   */
  MAILER_BLOCKED = "MB",
  /**
   * Both carrier and mailer have been blocked by each other
   */
  BOTH_BLOCKED = "BB",
}

@Entity()
export class CarrierMailer extends BaseEntity {
  @PrimaryColumn()
  carrierId: number;

  @PrimaryColumn()
  mailerId: number;

  @Column({ type: "enum", enum: CarrierMailerRelation })
  relationStatus: CarrierMailerRelation;

  @ManyToOne(() => Carrier, (carrier) => carrier.mailerConnection, {
    primary: true,
  })
  @JoinColumn({ name: "carrierId" })
  carrier: Carrier;

  @ManyToOne(() => Mailer, (mailer) => mailer.carrierConnection, {
    primary: true,
  })
  @JoinColumn({ name: "mailerId" })
  mailer: Mailer;
}
