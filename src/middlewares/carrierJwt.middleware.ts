import { NextFunction, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { Carrier } from "../entity";
import { COOKIE_VARS } from "../utils/constants";
import { createCarrierTokens } from "../utils/functions/createTokens";

export const carrierJwtMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies[COOKIE_VARS.carrier.access.name];
  const refreshToken = req.cookies[COOKIE_VARS.carrier.refresh.name];

  if (!refreshToken && !accessToken) {
    return next();
  }

  try {
    const data = verify(
      accessToken,
      process.env.CARRIER_ACCESS_JWT_KEY!
    ) as JwtPayload;
    (req as any).carrierId = data.carrierId;
    return next();
  } catch {}

  let data: JwtPayload;
  try {
    data = verify(
      refreshToken,
      process.env.CARRIER_REFRESH_JWT_KEY!
    ) as JwtPayload;
  } catch {
    return next();
  }
  const carrier = await Carrier.findOne(data!.carrierId);

  if (!carrier || carrier.count != data!.count) {
    console.log("Count different!");
    return next();
  }

  const newTokens = createCarrierTokens(carrier);

  res.cookie(COOKIE_VARS.carrier.refresh.name, newTokens.refreshToken, {
    httpOnly: true,
    maxAge: COOKIE_VARS.carrier.refresh.maxAge.ms,
  });
  res.cookie(COOKIE_VARS.carrier.access.name, newTokens.accessToken, {
    httpOnly: true,
    maxAge: COOKIE_VARS.carrier.refresh.maxAge.ms,
  });

  req.userId = carrier.id;
  next();
};
