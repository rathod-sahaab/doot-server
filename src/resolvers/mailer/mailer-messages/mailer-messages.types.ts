import { Length } from "class-validator";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class PhoneInput {
  @Field()
  @Length(10, 10, { message: "phone number should be 10 characters long" })
  num: String;

  @Field(() => Int)
  country: number;
}

@InputType()
export class SendMessageInput {
  @Field()
  text: String;

  @Field()
  phone: PhoneInput;
}

export class BatchMessageInput {
  @Field(() => [SendMessageInput])
  messages: SendMessageInput[];
}

@InputType()
export class BroadcastInput {
  @Field()
  text: String;

  @Field(() => [PhoneInput])
  phones: PhoneInput[];
}
