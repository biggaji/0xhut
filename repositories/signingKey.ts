import { SigningKeyModel as SigningKey } from "../models/signingKeys.model.js";
import { SigningKeyScope } from "../types/sharedTypes.js";
import AuthServerRepository from "./authServer.js";
import * as crypto from "crypto";

const authServerRepository = new AuthServerRepository();
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
      const server = await authServerRepository.retrieveServerData(authServerId);
      const generatedSigningKey = await this.generateSigningKeyForAuthServer(authServerId);
      const signingKey = new SigningKey({
        key: generatedSigningKey,
        scope,
        server
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
  async revokeAuthServerSigningKey(authServerId: string) {
    try {
      const now = new Date();
      const signingKeyRevoked = await SigningKey.updateOne({ server: authServerId }, { revoked: true , revokedAt: now }, { new : true, useFindAndModify: false });
      return (signingKeyRevoked.acknowledged === true) ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async signingKeyIsRevoked(serverId: string) {
    return ((await SigningKey.findOne({ server: serverId }))?.revoked === true) ? true : false;
  }
}