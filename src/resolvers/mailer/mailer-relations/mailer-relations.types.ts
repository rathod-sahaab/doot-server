import { Field, ID, InputType } from "type-graphql";

@InputType()
export class AddConnectionInput {
  @Field(() => ID)
  carrierId: number;
}
