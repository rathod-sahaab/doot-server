import { sign } from "jsonwebtoken";
import { Mailer } from "../../entity";
import { COOKIE_VARS } from "../constants";

export const createMailerTokens = (mailer: Mailer) => {
  const accessToken = sign(
    { mailerId: mailer.id },
    process.env.MAILER_ACCESS_JWT_KEY!,
    { expiresIn: COOKIE_VARS.mailer.access.maxAge.str }
  );
  const refreshToken = sign(
    { mailerId: mailer.id, count: mailer.count },
    process.env.MAILER_REFRESH_JWT_KEY!,
    { expiresIn: COOKIE_VARS.mailer.refresh.maxAge.ms }
  );

  return { accessToken, refreshToken };
};
