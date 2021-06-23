import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Message } from "../../../entity";
import { Phone } from "../../../entity/embed/Phone";
import { MyContext } from "../../../utils/types/MyContext";
import { BroadcastInput, SendMessageInput } from "./mailer-messages-types";

@Resolver()
export class MailerMessagesResolver {
  @Query(() => [Message], { nullable: true })
  async messages(@Ctx() ctx: MyContext) {
    if (!ctx.req.mailerId) {
      return null;
    }

    const mailerId = ctx.req.mailerId;

    return await Message.find({ mailerId });
  }

  @Mutation(() => Message, { nullable: true })
  async sendMessage(
    @Arg("data") { text, phone }: SendMessageInput,
    @Ctx() ctx: MyContext
  ) {
    if (!ctx.req.mailerId) {
      return null;
    }
    let message = new Message();
    message.phone = new Phone();

    message.text = text.toString();
    message.phone.num = phone.num.toString();
    message.phone.country = phone.country;
    message.mailerId = ctx.req.mailerId;

    return await message.save();
  }

  @Mutation(() => [Message], { nullable: true })
  async broadcast(
    @Arg("data") { text, phones }: BroadcastInput,
    @Ctx() ctx: MyContext
  ) {
    if (!ctx.req.mailerId) {
      return null;
    }

    const TEXT = text.toString();
    const mailerId = ctx.req.mailerId;

    const messagePromises = phones.map(async (phone) => {
      return await Message.create({
        text: TEXT,
        phone: {
          num: phone.num.toString(),
          country: phone.country,
        },
        mailerId,
      }).save();
    });

    return await Promise.all(messagePromises);
  }
}
