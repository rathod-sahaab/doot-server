import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CarrierRegisterInput {
  @Field()
  @Length(3, 18, { message: "Username should be between 3-18 characters long" })
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(6, 60, { message: "Password should be between 6-60 characters long" })
  password: string;
}

@InputType()
export class CarrierLoginInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
