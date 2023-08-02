import { ForbiddenError, NotFoundError, UnAuthorizedError } from "../@commons/errorHandlers.js";
import { AuthServerModel as AuthServer } from "../models/authServers.model.js";
import { CreateAuthServerOption, HydratedServer, SigningKeyScope, UserDocument } from "../types/sharedTypes.js";
import SigningKeyRepository from "./signingKey.js";
import SharedAccessTokenRepository from "./sat.js";

const sharedAccessRepository = new SharedAccessTokenRepository();

const signingKeyRepository = new SigningKeyRepository();

/**
 * @class AuthServerRepository
 */

export default class AuthServerRepository {
  constructor() {}

  /**
   * @param opts 
   * @returns 
   */
  async createAuthServer(opts: CreateAuthServerOption) {
    try {
      const { email, name, password } = opts;
      const server = new AuthServer({
        email, password, name
      });

      await server.save();
      return server;
    } catch (error) {
      throw error;
    }
  }

  async retrieveServerId(id: string) {
    try {
      // first check if server exist
      if (!(await this.checkServerExist("id", id))) {
        throw new NotFoundError(`server with id '${id}' not found`);
      }

      const server = await AuthServer.findOne({ _id: id });
      return server?._id;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param id 
   * @returns object 
   */
  async retrieveServerData(id: string) {
    try {
      // first check if server exist
      if (!(await this.checkServerExist("id", id))) {
        throw new NotFoundError(`server with id '${id}' not found`);
      }

      const server = await AuthServer.findOne({ _id: id });
      return server;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param identifier 
   * @param key 
   * @returns 
   */
  async checkServerExist(identifier: 'email' | 'id', key: string) {
    try {
      let response = false;
      let server;
      switch(identifier) {
        case "email":
          server = await AuthServer.findOne({ email: key });
          break;
        case "id":
          server = await AuthServer.findOne({ id: key });
          break;
      };
      
      if (server?._id) {
        response = true;
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
 * @description Checks auth server scope to determine if it can issue a SAT (shared access token) to a user
 * @param authServerScope 
 * @returns boolean
 */
  private async authServerCanIssueSharedAccessToken(authServerScope: SigningKeyScope) {
    return (authServerScope !== "server:read") ? true : false;
  }

  /**
   * @param user 
   * @param hydratedServer 
   * @returns string
   */
  async issueSharedAccessTokenToUser(user: UserDocument, hydratedServer: HydratedServer) {
    try {
      const serverCanIssue = await this.authServerCanIssueSharedAccessToken(hydratedServer.scope);
      
      if (serverCanIssue) {
        // check if signing token is not revoked yet
        const signingKeyRevokedState = await signingKeyRepository.isSigningKeyRevoked(hydratedServer.id);
        if (signingKeyRevokedState) {
          throw new ForbiddenError("Server signing key is revoked, generated a new one");
        }
        // issue token for user
        const tokenIssurance = await sharedAccessRepository.createSharedAccessToken({ user, hydratedServer }) 
        return { sharedAccessToken: tokenIssurance.token };
      } else {
        throw new UnAuthorizedError("Server can't issue SAT for user, update your server scope to either 'server:write' or 'server:read:write'");
      }
    } catch (error) {
      throw error;
    }
  }
}
