import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { Carrier } from "../../../entity";
import { CarrierLoginInput, CarrierRegisterInput } from "./carrier-crud.types";
import * as bcrypt from "bcryptjs";
import { MyContext } from "../../../utils/types/MyContext";
import { createCarrierTokens } from "../../../utils/functions/createTokens";
import { COOKIE_VARS } from "../../../utils/constants";

@Resolver()
export class CarrierCrudResolver {
  @Query(() => Carrier, { nullable: true })
  async me(@Ctx() ctx: MyContext) {
    const carrierId = (ctx.req as any).carrierId;
    if (!carrierId) {
      return null;
    }

    return await Carrier.findOne(carrierId);
  }

  @Mutation(() => Carrier, { nullable: true })
  async register(
    @Arg("data")
    { username, email, password }: CarrierRegisterInput
  ): Promise<Carrier> {
    const passwordHash = await bcrypt.hash(password, 12);

    const carrier = await Carrier.create({
      username,
      email,
      passwordHash,
    }).save();

    return carrier;
  }

  @Mutation(() => Carrier, { nullable: true }) async login(
    @Arg("data") { username, password }: CarrierLoginInput,
    @Ctx() ctx: MyContext
  ): Promise<Carrier | null> {
    const carrier = await Carrier.findOne({ where: { username: username } });

    if (!carrier) {
      return null;
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      carrier.passwordHash
    );
    if (!passwordCorrect) {
      return null;
    }

    const { accessToken, refreshToken } = createCarrierTokens(carrier);

    const carrier_cookie = COOKIE_VARS.carrier;

    ctx.res.cookie(carrier_cookie.refresh.name, refreshToken, {
      httpOnly: true,
      maxAge: carrier_cookie.refresh.maxAge.ms, // mili seconds
    });
    ctx.res.cookie(carrier_cookie.access.name, accessToken, {
      httpOnly: true,
      maxAge: carrier_cookie.access.maxAge.ms, // mili seconds
    });

    return carrier;
  }

  @Mutation()
  async invalidateTokens(@Ctx() ctx: MyContext): Promise<boolean> {
    const carrierId = ctx.req.carrierId;
    if (!carrierId) {
      return false;
    }

    const carrier = await Carrier.findOne(carrierId);
    if (!carrier) {
      return false;
    }

    carrier.count = carrier.count + 1;
    await carrier.save();

    return true;
  }
}
