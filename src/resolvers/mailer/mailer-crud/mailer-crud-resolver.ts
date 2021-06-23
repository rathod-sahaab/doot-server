import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { Mailer } from "../../../entity";
import { MailerLoginInput, MailerRegisterInput } from "./mailer-crud-types";
import * as bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { MyContext } from "../../../utils/types/MyContext";

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

    const refreshToken = sign(
      { mailerId: mailer.id, count: mailer.count },
      process.env.MAILER_REFRESH_JWT_KEY!,
      { expiresIn: "7d" }
    );
    const accessToken = sign(
      { mailerId: mailer.id },
      process.env.MAILER_ACCESS_JWT_KEY!,
      { expiresIn: "15m" }
    );

    ctx.res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 3600 * 1000, // mili seconds
    });
    ctx.res.cookie("access-token", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // mili seconds
    });

    return mailer;
  }
}
