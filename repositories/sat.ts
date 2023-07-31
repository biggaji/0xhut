import { SatModel } from "../models/sats.model.js";
import { CreateSharedAccessTokenOption } from "../types/sharedTypes.js";
import jwt from "jsonwebtoken";
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
      const { user, server, hydratedServer } = opts;
      const sharedAccessToken = await this.generateSharedAccessToken({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        sub: user._id,
        issuingServerId: hydratedServer.id
      }, hydratedServer.serverSigningKey);

      const satDocument = new SatModel({
        issuedToUser: user,
        issuingServer: server,
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
    const oneHourExpiryTime = 60 * 60; //1hr
    const token = jwt.sign(objectToBeTokenized, issuingServerSigningKey, { expiresIn: oneHourExpiryTime, issuer: payload.issuingServerId });
    return token;
  }

  async revokeSharedAccessToken() {}

  async deleteSharedAccessToken() {}
}