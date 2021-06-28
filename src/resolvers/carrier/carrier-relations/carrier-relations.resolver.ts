import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { CarrierMailer, Mailer } from "../../../entity";
import { CarrierMailerRelation } from "../../../entity/CarrierMailer";
import { MyContext } from "../../../utils/types/MyContext";
import { AddMailerInput } from "./carrier-relations.types";

@Resolver()
export class CarrierRelationsResolver {
  /**
   * Send a 'friend' request to mailer
   */
  @Mutation(() => Boolean)
  async addMailer(
    @Arg("data") { username }: AddMailerInput,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const carrierId = ctx.req.carrierId;
    if (!carrierId) {
      return false;
    }

    const mailer = await Mailer.findOne({ where: { username: username } });
    if (!mailer) {
      return false;
    }

    await CarrierMailer.create({
      carrierId,
      mailerId: mailer.id,
      relationStatus: CarrierMailerRelation.REQUEST_BY_CARRIER,
    }).save();
    return true;
  }

  @Mutation(() => Boolean)
  async removeMailer(
    @Arg("data") { username }: AddMailerInput,
    @Ctx() ctx: MyContext
  ) {
    const carrierId = ctx.req.carrierId;
    if (!carrierId) {
      return false;
    }

    const mailer = await Mailer.findOne({ where: { username: username } });
    if (!mailer) {
      return false;
    }

    const carrierMailer = await CarrierMailer.findOne({
      where: {
        carrierId,
        mailerId: mailer.id,
      },
    });

    if (!carrierMailer) {
      return false;
    }

    carrierMailer.remove();

    return true;
  }

  @Mutation(() => Boolean)
  async blockMailer(
    @Arg("data") { username }: AddMailerInput,
    @Ctx() ctx: MyContext
  ) {
    const carrierId = ctx.req.carrierId;
    if (!carrierId) {
      return false;
    }

    const mailer = await Mailer.findOne({ where: { username: username } });
    if (!mailer) {
      return false;
    }

    const carrierMailer = await CarrierMailer.findOne({
      where: {
        carrierId,
        mailerId: mailer.id,
      },
    });

    if (!carrierMailer) {
      return false;
    }

    switch (carrierMailer.relationStatus) {
      case CarrierMailerRelation.MAILER_BLOCKED:
      case CarrierMailerRelation.BOTH_BLOCKED:
        return true;
      case CarrierMailerRelation.CARRIER_BLOCKED:
        carrierMailer.relationStatus = CarrierMailerRelation.BOTH_BLOCKED;
        break;
      default:
        carrierMailer.relationStatus = CarrierMailerRelation.MAILER_BLOCKED;
        break;
    }

    await carrierMailer.save();

    return true;
  }

  @Mutation(() => Boolean)
  async unblockMailer(
    @Arg("data") { username }: AddMailerInput,
    @Ctx() ctx: MyContext
  ) {
    const carrierId = ctx.req.carrierId;
    if (!carrierId) {
      return false;
    }

    const mailer = await Mailer.findOne({ where: { username: username } });
    if (!mailer) {
      return false;
    }

    const carrierMailer = await CarrierMailer.findOne({
      where: {
        carrierId,
        mailerId: mailer.id,
      },
    });

    if (!carrierMailer) {
      return false;
    }

    switch (carrierMailer.relationStatus) {
      case CarrierMailerRelation.MAILER_BLOCKED:
        carrierMailer.remove(); // should send request again
        return true;
      case CarrierMailerRelation.BOTH_BLOCKED:
        carrierMailer.relationStatus = CarrierMailerRelation.CARRIER_BLOCKED;
        break;
      default:
        return true;
    }

    await carrierMailer.save();

    return true;
  }
}
