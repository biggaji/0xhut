import { NextFunction, Request, Response } from "express";
import SigningKeyService from "../services/signingKey.js";
import { BadRequestError, ForbiddenError } from "./errorHandlers.js";

const signingKeyService = new SigningKeyService();

/**
 * @function validateAuthServerSigningKey
 * @param req 
 * @param res 
 * @param next 
 */

export async function validateAuthServerSigningKey(req: Request, res: Response, next: NextFunction) {
  try {
    const signingKey = req.headers.authorization || req.headers.x_signing_k;

    if (!signingKey || signingKey === "" || typeof signingKey === "object") {
      throw new BadRequestError(`Provide server's signing key`);
    }

    // validate key
    const signingKeyIsValid = await signingKeyService.validateSigningKey(signingKey);

    if (signingKeyIsValid) {
      req.identity = signingKey;
      next();
    } else {
      throw new ForbiddenError(`Invalid or expired signing key provided`);
    }
  } catch (error) {
    console.error(`An error occured while validating auth server signing key`);
    next(error);
  }
}