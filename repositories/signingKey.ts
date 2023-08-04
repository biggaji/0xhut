import mongoose from "mongoose";
import { NotFoundError } from "../@commons/errorHandlers.js";
import { SigningKeyModel as SigningKey } from "../models/signingKeys.model.js";
import { SigningKeyScope } from "../types/sharedTypes.js";
import * as crypto from "crypto";

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
    const hashKey = `${authServerId}:${randomBytes}`;
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

  async getAuthServerBySigningKey(signingKey: string) {
    try {
      const signKey = await SigningKey.findOne({ key: signingKey});

      if (!signKey) {
        throw new NotFoundError(`Signing key not found`);
      }
      
      return signKey?.server;
    } catch (error) {
      throw error;
    }
  }

  async isSigningKeyRevoked(key: string) {
    return ((await SigningKey.findOne({ key: key }))?.revoked === true) ? true : false;
  }

  async validateSigningKey(key: string) {
    try {
      const signingKeyDocument = await SigningKey.findOne({ key: key});

      if (!signingKeyDocument) {
        throw new NotFoundError("Signing key not found, can't be validated");
      }
      // check if it is not revoked
      await this.isSigningKeyRevoked(signingKeyDocument.key);

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

  async deleteSigningForAuthServer(serverId: string, session: mongoose.ClientSession | null) {
    try {
      return await SigningKey.deleteOne({ server: serverId }).session(session);
    } catch (error) {
      throw error;
    }
  }
}