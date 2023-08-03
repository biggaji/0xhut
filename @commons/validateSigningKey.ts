import { NextFunction, Request, Response } from "express";
import SigningKeyService from "../services/signingKey.js";
import { BadRequestError, ForbiddenError } from "./errorHandlers.js";
import SigningKeyRepository from "../repositories/signingKey.js";

const signingKeyService = new SigningKeyService();
const signingKeyRepository = new SigningKeyRepository();

/**
 * @function validateAuthServerSigningKey
 * @param req 
 * @param res 
 * @param next 
 */

export async function validateAuthServerSigningKey(req: Request, res: Response, next: NextFunction) {
  try {
    const signingKey = req.headers["x-signing-k"];

    if (!signingKey || signingKey === "" || typeof signingKey === "object") {
      throw new BadRequestError(`Provide server's signing key`);
    }

    // validate key
    const signingKeyIsValid = await signingKeyService.validateSigningKey(signingKey);
    const serverFromSigningKey = await signingKeyRepository.getAuthServerBySigningKey(signingKey);
    if (!signingKeyIsValid) {
      throw new ForbiddenError(`Invalid or expired signing key provided`);
    }

    req.identity = serverFromSigningKey;
    next();
  } catch (error) {
    console.error(`An error occured while validating auth server signing key`, error);
    next(error);
  }
}