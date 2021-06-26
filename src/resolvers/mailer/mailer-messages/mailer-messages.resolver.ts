import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Message } from "../../../entity";
import { MyContext } from "../../../utils/types/MyContext";
import {
  BatchMessageInput,
  BroadcastInput,
  SendMessageInput,
} from "./mailer-messages.types";

@Resolver()
export class MailerMessagesResolver {
  /**
   * Get all messages created by the mailer.
   * TODO: Add message filtering feature.
   */
  @Query(() => [Message], { nullable: true })
  async messages(@Ctx() ctx: MyContext) {
    if (!ctx.req.mailerId) {
      return null;
    }

    const mailerId = ctx.req.mailerId;

    return await Message.find({ mailerId });
  }

  /**
   * Submit send a message to mentioned number.
   */
  @Mutation(() => Message, { nullable: true })
  async sendMessage(
    @Arg("data") { text, phone }: SendMessageInput,
    @Ctx() ctx: MyContext
  ) {
    const mailerId = ctx.req.mailerId;
    if (!mailerId) {
      return null;
    }

    return await Message.create({
      text: text.toString(),
      phone: {
        num: phone.num.toString(),
        country: phone.country,
      },
      mailerId,
    }).save();
  }

  /**
   * Just like sendMessage but submit multiple such messages
   * in a single API request so better network performance.
   */
  @Mutation(() => [Message], { nullable: true })
  async batchMessages(
    @Arg("data") { messages }: BatchMessageInput,
    @Ctx() ctx: MyContext
  ) {
    const mailerId = ctx.req.mailerId;
    if (!mailerId) {
      return null;
    }

    const messagePromises = messages.map(async (message) => {
      return await Message.create({
        text: message.text.toString(),
        phone: {
          num: message.phone.num.toString(),
          country: message.phone.country,
        },
        mailerId,
      }).save();
    });

    return await Promise.all(messagePromises);
  }

  /**
   * Send same message to multiple numbers, like radio broadcast.
   */
  @Mutation(() => [Message], { nullable: true })
  async broadcast(
    @Arg("data") { text, phones }: BroadcastInput,
    @Ctx() ctx: MyContext
  ) {
    const mailerId = ctx.req.mailerId;
    if (!mailerId) {
      return null;
    }

    const TEXT = text.toString();

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
