import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Carrier, CarrierMailer } from "../../../entity";
import { CarrierMailerRelation } from "../../../entity/CarrierMailer";
import { MyContext } from "../../../utils/types/MyContext";
import { AddConnectionInput } from "./mailer-relations.types";

@Resolver()
export class MailerRelationsResolver {
  @Query(() => [Carrier])
  async connectionRequests(@Ctx() ctx: MyContext) {
    const mailerId = ctx.req.mailerId;
    if (!mailerId) {
      return null;
    }

    return await CarrierMailer.query(`
SELECT carrier.*
FROM carrier_mailer inner join carrier on carrier_mailer."carrierId" = carrier.id
where carrier_mailer."mailerId" = ${mailerId} and carrier_mailer."relationStatus" = '${CarrierMailerRelation.REQUEST_BY_CARRIER.toString()}';
`);
  }

  @Mutation(() => Boolean, { nullable: true })
  async acceptConnectionRequest(
    @Arg("data") { carrierId }: AddConnectionInput,
    @Ctx() ctx: MyContext
  ): Promise<boolean | null> {
    const mailerId = ctx.req.mailerId;
    if (!mailerId) {
      // not logged in
      return null;
    }
    const carrierMailer = await CarrierMailer.findOne({ carrierId });
    if (!carrierMailer) {
      return false;
    }
    carrierMailer.relationStatus = CarrierMailerRelation.CONNECTED;
    await carrierMailer.save();
    return true;
  }
}
