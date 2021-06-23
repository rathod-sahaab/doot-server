import { Arg, Mutation, Resolver } from "type-graphql";
import { Mailer, Message } from "../../../entity";
import { Phone } from "../../../entity/embed/Phone";
import { SendMessageInput } from "./mailer-messages-types";

@Resolver()
export class MailerMessagesResolver {
  @Mutation(() => Message)
  async sendMessage(@Arg("data") { text, phone }: SendMessageInput) {
    let message = new Message();
    message.phone = new Phone();

    message.text = text.toString();
    message.phone.num = phone.num.toString();
    message.phone.country = phone.country;

    return await message.save();
  }
}
