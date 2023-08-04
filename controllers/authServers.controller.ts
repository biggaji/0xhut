import { Request, Response, NextFunction } from "express";
import AuthServerService from "../services/authServer.js";
import { HydratedServer } from "../types/sharedTypes.js";
import SigningKeyRepository from "../repositories/signingKey.js";
const authServerService = new AuthServerService();
const signingKeyRepository = new SigningKeyRepository();

export const handleAuthServerCreation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.body;
    const response = await authServerService.createServer(query);
    const signingKeyData = await signingKeyRepository.retrieveSigningKeyForServer(response._id as unknown as string);
    const hydratedServer: HydratedServer = {
      id: response._id,
      name: response.name,
      scope: signingKeyData.scope,
      serverSigningKey: signingKeyData.key
    };

    res.status(201).json({
      success: true,
      message: "Auth server created, please keep your signing key secure",
      server: hydratedServer
    })
  } catch (error) {
    throw error;
  }
}

export const handleIssuingSharedAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCred = req.body;
    const serverId = req.identity;
    const sat = await authServerService.issueSharedAccessTokenToUser(userCred, serverId as unknown as string)
    return res.status(201).json({ sharedAccessToken: sat });
  } catch (error) {
    next(error);
  }
}