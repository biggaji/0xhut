import mongoose from "mongoose";
import { SatModel } from "../models/sats.model.js";
import { CreateSharedAccessTokenOption } from "../types/sharedTypes.js";
import jwt from "jsonwebtoken";
import { NotFoundError } from "../@commons/errorHandlers.js";
/**
 * @class SharedAccessTokenRepository
 */

export default class SharedAccessTokenRepository {
  constructor() {}

  /**
   * @description Creates a new SAT document
   * @param opts { CreateSharedAccessTokenOption }
   */
  async createSharedAccessToken(opts: CreateSharedAccessTokenOption) {
    try {
      const { user, hydratedServer } = opts;
      const sharedAccessToken = await this.generateSharedAccessToken({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        sub: user._id,
        issuingServerId: hydratedServer.id
      }, hydratedServer.serverSigningKey);

      const satDocument = new SatModel({
        issuedToUser: new mongoose.Types.ObjectId(user._id),
        issuingServer: new mongoose.Types.ObjectId(hydratedServer.id) ,
        token: sharedAccessToken
      });

      await satDocument.save();
      return satDocument;
    } catch (error) {
     throw error; 
    }
  }

  /**
   * @param payload 
   * @param issuingServerSigningKey 
   * @returns string
   */

  private async generateSharedAccessToken(payload: { sub: string, email: string, firstName: string, lastName: string , issuingServerId: string}, issuingServerSigningKey: string) {
    const objectToBeTokenized = payload;
    const oneHourExpiryTime = 60 * 60 * (24 * 7); // 7days
    const token = jwt.sign(objectToBeTokenized, issuingServerSigningKey, { expiresIn: oneHourExpiryTime, issuer: payload.issuingServerId.toString() });
    return token;
  }

  async revokeSharedAccessToken(sat: string) {
    try {
      const sharedAccessTokenData = await SatModel.findOneAndUpdate({ token: sat }, { revoked: true, revokedAt: new Date() });
      if (!sharedAccessTokenData) {
        throw new NotFoundError("Shared access token data not found");
      }

      return (sharedAccessTokenData.revoked === true) ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async deleteSharedAccessTokenIssuedByAuthServer(serverId: string, session: mongoose.ClientSession | null) {
    try {
      return await SatModel.deleteMany({ issuingServer: serverId }).session(session);;
    } catch (error) {
      throw error;
    }
  }
}