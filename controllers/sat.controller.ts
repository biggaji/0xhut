import { NextFunction, Request, Response } from "express";
import SharedAccessTokenRepository from "../repositories/sat.js";
import { BadRequestError } from "../@commons/errorHandlers.js";
const sharedAccessTokenRepository = new SharedAccessTokenRepository();

export async function handleSharedAccessTokenRevoke(req: Request, res: Response, next: NextFunction) {
  try {
    const sat = req.body.sat;
    if (!sat || sat === "") {
      throw new BadRequestError("Provided shares access token to be revoked");
    }

    const revokedSATResponse = await sharedAccessTokenRepository.revokeSharedAccessToken(sat);
    return res.status(200).json({
      revoked: revokedSATResponse
    });
  } catch (error) {
    next(error);
  }
};