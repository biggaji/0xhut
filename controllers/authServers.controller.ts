import { Request, Response, NextFunction } from "express";
import AuthServerService from "../services/authServer.js";
const authServerService = new AuthServerService();

export const handleAuthServerCreation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.body;
    const response = await authServerService.createServer(query);
    res.status(201).json({
      success: true,
      message: "Auth server created",
      serverId: response._id
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