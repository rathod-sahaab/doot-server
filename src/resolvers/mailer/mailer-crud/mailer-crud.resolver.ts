import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { Mailer } from "../../../entity";
import { MailerLoginInput, MailerRegisterInput } from "./mailer-crud.types";
import * as bcrypt from "bcryptjs";
import { MyContext } from "../../../utils/types/MyContext";
import { createMailerTokens } from "../../../utils/functions/createTokens";
import { COOKIE_VARS } from "../../../utils/constants";
import { GraphQLBoolean } from "graphql";

@Resolver()
export class MailerCrudResolver {
  @Query(() => Mailer, { nullable: true })
  async me(@Ctx() ctx: MyContext) {
    const mailerId = (ctx.req as any).mailerId;
    if (!mailerId) {
      return null;
    }

    return await Mailer.findOne(mailerId);
  }

  @Mutation(() => Mailer, { nullable: true })
  async register(
    @Arg("data")
    { username, email, password }: MailerRegisterInput
  ): Promise<Mailer> {
    const passwordHash = await bcrypt.hash(password, 12);

    const mailer = await Mailer.create({
      username,
      email,
      passwordHash,
    }).save();

    return mailer;
  }

  @Mutation(() => Mailer, { nullable: true }) async login(
    @Arg("data") { username, password }: MailerLoginInput,
    @Ctx() ctx: MyContext
  ): Promise<Mailer | null> {
    const mailer = await Mailer.findOne({ where: { username: username } });

    if (!mailer) {
      return null;
    }

    const passwordCorrect = await bcrypt.compare(password, mailer.passwordHash);
    if (!passwordCorrect) {
      return null;
    }

    const { accessToken, refreshToken } = createMailerTokens(mailer);

    const mailer_cookie = COOKIE_VARS.mailer;

    ctx.res.cookie(mailer_cookie.refresh.name, refreshToken, {
      httpOnly: true,
      maxAge: mailer_cookie.refresh.maxAge.ms, // mili seconds
    });
    ctx.res.cookie(mailer_cookie.access.name, accessToken, {
      httpOnly: true,
      maxAge: mailer_cookie.access.maxAge.ms, // mili seconds
    });

    return mailer;
  }

  @Mutation(() => GraphQLBoolean)
  async invalidateTokens(@Ctx() ctx: MyContext): Promise<boolean> {
    const mailerId = ctx.req.mailerId;
    if (!mailerId) {
      return false;
    }

    const mailer = await Mailer.findOne(mailerId);
    if (!mailer) {
      return false;
    }

    mailer.count = mailer.count + 1;
    await mailer.save();

    return true;
  }
}
