import { Field, ID, InputType } from "type-graphql";
@InputType()
export class MarkMessagesSentInput {
  @Field(() => [ID])
  messageIds: number[];
}
