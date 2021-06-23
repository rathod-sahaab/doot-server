import { Field, ObjectType } from "type-graphql";
import { Column } from "typeorm";

@ObjectType()
export class Phone {
  @Field()
  @Column()
  num: string;

  @Field()
  @Column()
  country: number;
}
