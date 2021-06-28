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
    return await CarrierMailer.find({
      where: {
        mailerId,
        relationStatus: CarrierMailerRelation.REQUEST_BY_CARRIER,
      },
      select: ["carrier"],
    });
  }

  @Mutation()
  async acceptConnectionRequest(
    @Arg("data") { carrierId }: AddConnectionInput,
    @Ctx() ctx: MyContext
  ): Promise<boolean | null> {
    const mailerId = !ctx.req.mailerId;
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
