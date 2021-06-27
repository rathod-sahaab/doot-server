import { sign } from "jsonwebtoken";
import { Carrier, Mailer } from "../../entity";
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

export const createCarrierTokens = (carrier: Carrier) => {
  const accessToken = sign(
    { carrierId: carrier.id },
    process.env.CARRIER_ACCESS_JWT_KEY!,
    { expiresIn: COOKIE_VARS.carrier.access.maxAge.str }
  );
  const refreshToken = sign(
    { carrierId: carrier.id, count: carrier.count },
    process.env.CARRIER_REFRESH_JWT_KEY!,
    { expiresIn: COOKIE_VARS.carrier.refresh.maxAge.ms }
  );

  return { accessToken, refreshToken };
};
