import { AuthServerModel } from "../models/authServers.model.js";
import { CreateAuthServerOption } from "../types/sharedTypes.js";
import SigningKeyRepository from "./signingKey.js";

const signingKeyRepository = new SigningKeyRepository();

/**
 * @class AuthServerRepository
 */

export default class AuthServerRepository {
  constructor() {}

  async createAuthServer(opt: CreateAuthServerOption) {}

  async requestSharedAccessTokenForUser(userId: string) {}

  async requestToRevokeUserSharedAccessToken(userId: string) {}
}