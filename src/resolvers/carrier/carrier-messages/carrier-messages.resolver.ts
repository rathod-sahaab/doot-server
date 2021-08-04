import { Ctx, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Carrier, Message } from "../../../entity";
import { CarrierMailerRelation } from "../../../entity/CarrierMailer";
import { Phone } from "../../../entity/embed/Phone";
import { MyContext } from "../../../utils/types/MyContext";

@Resolver()
export class CarrierMessagesResolver {
  @Query(() => [Message], { nullable: true })
  async unsentMessages(@Ctx() ctx: MyContext): Promise<Message[] | null> {
    const carrierId = ctx.req.carrierId;
    if (!carrierId) {
      return null;
    }

    const statement = `
SELECT "message".*
FROM carrier
INNER JOIN carrier_mailer ON carrier.id = carrier_mailer."carrierId"
INNER JOIN mailer ON mailer.id = carrier_mailer."mailerId"
INNER JOIN "message" ON mailer.id = "message"."mailerId"
WHERE
carrier.id = ${carrierId}
AND
"message"."sent" = 'f'
AND
carrier_mailer."relationStatus" = '${CarrierMailerRelation.CONNECTED.toString()}';
`;

    const messagesRaw: any[] = await getConnection().query(statement);

    const messages = messagesRaw.map(
      (messageRaw): Message => {
        let message = new Message();
        message.id = messageRaw.id;
        message.text = messageRaw.text;
        message.sent = messageRaw.sent;
        message.mailerId = messageRaw.mailerId;
        message.carrierId = messageRaw.carrierId;
        message.phone = new Phone();
        message.phone.num = messageRaw.phoneNum;
        message.phone.country = messageRaw.phoneCountry;
        return message;
      }
    );

    return messages;
  }
}
