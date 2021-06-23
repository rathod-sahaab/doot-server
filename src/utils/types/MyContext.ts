import { Request, Response } from "express";

/**
 * Allow additional properties on request
 */
interface ExtendedRequest extends Request {
  [key: string]: any;
}

export interface MyContext {
  req: ExtendedRequest;
  res: Response;
}
