import { SigningKeyModel } from "../models/signingKeys.model.js";
import { SigningKeyScope } from "../types/sharedTypes.js";
/**
 * @class SigningKeyRepository
 */

export default class SigningKeyRepository {
  constructor() {}

  async issueSigningKeyToAuthServer(authServerId: string, scope: SigningKeyScope) {

  }

  async revokeAuthServerSigningKey(authServerId: string) {

  }

  private async authServerCanIssueToken(authServerScope: SigningKeyScope) {
    return (authServerScope !== "server:read") ? true : false;
  }
}