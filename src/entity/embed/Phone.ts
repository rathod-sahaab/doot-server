import { Column } from "typeorm";

export class Phone {
  @Column()
  num: string;

  @Column()
  country: number;
}
