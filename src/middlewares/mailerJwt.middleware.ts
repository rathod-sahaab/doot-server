import { NextFunction, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { Mailer } from "../entity";
import { COOKIE_VARS } from "../utils/constants";
import { createMailerTokens } from "../utils/functions/createTokens";

export const mailerJwtMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies[COOKIE_VARS.mailer.access.name];
  const refreshToken = req.cookies[COOKIE_VARS.mailer.refresh.name];

  if (!refreshToken && !accessToken) {
    return next();
  }

  try {
    const data = verify(
      accessToken,
      process.env.MAILER_ACCESS_JWT_KEY!
    ) as JwtPayload;
    (req as any).mailerId = data.mailerId;
    return next();
  } catch {}

  let data: JwtPayload;
  try {
    data = verify(
      accessToken,
      process.env.MAILER_ACCESS_JWT_KEY!
    ) as JwtPayload;
  } catch {
    return next();
  }
  const mailer = await Mailer.findOne(data!.mailerId);

  if (!mailer || mailer.count != data!.count) {
    console.log("Count different!");
    return next();
  }

  const newTokens = createMailerTokens(mailer);

  res.cookie(COOKIE_VARS.mailer.refresh.name, newTokens.refreshToken, {
    httpOnly: true,
    maxAge: COOKIE_VARS.mailer.refresh.maxAge.ms,
  });
  res.cookie(COOKIE_VARS.mailer.access.name, newTokens.accessToken, {
    httpOnly: true,
    maxAge: COOKIE_VARS.mailer.refresh.maxAge.ms,
  });

  req.userId = mailer.id;
  next();
};
