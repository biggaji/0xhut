import { AuthServerModel as AuthServer } from "../models/authServers.model.js";
import { CreateAuthServerOption } from "../types/sharedTypes.js";
import SigningKeyRepository from "./signingKey.js";

const signingKeyRepository = new SigningKeyRepository();

/**
 * @class AuthServerRepository
 */

export default class AuthServerRepository {
  constructor() {}

  async createAuthServer(opts: CreateAuthServerOption) {
    try {
      const { email, name, password } = opts;
      const server = await new AuthServer({
        email, password, name
      });

      await server.save();
      return server;
    } catch (error) {
      throw error;
    }
  }

  async checkServerExist(email: string) {
    try {
      let response = false;
      const server = await AuthServer.findOne({ email: email });
      if (server?._id) {
        response = true;
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async requestSharedAccessTokenForUser(userId: string) {}

  async requestToRevokeUserSharedAccessToken(userId: string) {}
}
