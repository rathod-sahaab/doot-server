import { Ctx, Query, Resolver } from "type-graphql";
import { Carrier, CarrierMailer } from "../../../entity";
import { CarrierMailerRelation } from "../../../entity/CarrierMailer";
import { MyContext } from "../../../utils/types/MyContext";

@Resolver()
export class MailerRelationsResolver {
  @Query(() => [Carrier])
  async connectionRequests(@Ctx() ctx: MyContext) {
    const mailerId = ctx.req.mailerId;
    if (!mailerId) {
      return null;
    }
    return await CarrierMailer.find({
      where: {
        mailerId,
        relationStatus: CarrierMailerRelation.REQUEST_BY_CARRIER,
      },
      select: ["carrier"],
    });
  }
}
