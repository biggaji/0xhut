import mongoose from "mongoose";
import { ForbiddenError, NotFoundError } from "../@commons/errorHandlers.js";
import { SigningKeyModel as SigningKey } from "../models/signingKeys.model.js";
import { SigningKeyScope } from "../types/sharedTypes.js";
// import AuthServerRepository from "./authServer.js";
import * as crypto from "crypto";

// const authServerRepository = new AuthServerRepository();
/**
 * @class SigningKeyRepository
 * @description Manages the signing key lifecycle
 */

export default class SigningKeyRepository {
  constructor() {}
  /**
   * @member SigningKeyRepository
   * @param authServerId 
   * @param scope 
   * @description Generates and issues signing key to an auth server
   */
  async issueSigningKeyToAuthServer(authServerId: any, scope: SigningKeyScope) {
    try {
      const generatedSigningKey = await this.generateSigningKeyForAuthServer(authServerId);
      const signingKey = new SigningKey({
        key: generatedSigningKey,
        scope,
        server: new mongoose.Types.ObjectId(authServerId),
        expiresAt: new Date().setHours((24 * 7)) //7days
      });

      await signingKey.save();
      return signingKey;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Generates signing key with an authServerId
   * @param authServerId 
   * @returns string
   */
  private async generateSigningKeyForAuthServer(authServerId: string) {
    const randomBytes = crypto.randomBytes(16).toString("base64");
    const expiresAt = new Date().setHours((24 * 7)); //7 days
    const hashKey = `${authServerId}:${randomBytes}:${expiresAt}`;
    return crypto.createHash("sha256").update(hashKey).digest("hex");
  }
  
  /**
   * @description Updates an auth serevr signing revoke state to true 
   * @param authServerId 
   * @returns boolean
   */
  async revokeSigningKey(key: string) {
    try {
      const now = new Date();
      const signingKeyRevoked = await SigningKey.updateOne({ key: key }, { revoked: true , revokedAt: now }, { new : true, useFindAndModify: false });
      return (signingKeyRevoked.acknowledged === true) ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async isSigningKeyRevoked(serverId: string) {
    return ((await SigningKey.findOne({ server: serverId }))?.revoked === true) ? true : false;
  }

  async validateSigningKey(key: string) {
    try {
      const signingKeyDocument = await SigningKey.findOne({ key: key});

      if (!signingKeyDocument) {
        throw new NotFoundError("Signing key not found, can't be validated");
      }
      // check if it is not revoked
      await this.isSigningKeyRevoked(signingKeyDocument.key);
      // check for expiry
      const now = new Date();
      if (now > signingKeyDocument.expiresAt!) {
        throw new ForbiddenError("Signing key has expired, can't be validated");
      }

      return (signingKeyDocument._id) ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async retrieveSigningKeyForServer(serverId: string) {
    try {
      const signingKey = await SigningKey.findOne({ server: serverId, revoked: false });

      if (!signingKey) {
        throw new NotFoundError('Signing key not found for server or it might be revoked');
      }
      return signingKey;
    } catch (error) {
      throw error;
    }
  }

  // async renewSigningKey(serverId: string) {
  //   try {
      
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}