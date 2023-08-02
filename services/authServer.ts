import { CreateAuthServerOption, HydratedServer } from "../types/sharedTypes.js";
import { BadRequestError } from "../@commons/errorHandlers.js";
import * as bcrypt from "bcryptjs";
import AuthServerRepository from "../repositories/authServer.js";
import SigningKeyRepository from "../repositories/signingKey.js";
import UserService from "./user.js";

const userService = new UserService();
const authServerRepository = new AuthServerRepository();
const signingKeyRepository = new SigningKeyRepository();

/**
 * @class AuthServerService
 */

export default class AuthServerService {
  constructor() {}

  async createServer(opts: CreateAuthServerOption) {
    try {
      const { name, email } = opts;
      // validate opts ||
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      
      if (!name || name === "") {
        throw new BadRequestError("A server name is required");
      }

      if (!email || email === "" || !emailRegex.test(email)) {
        throw new BadRequestError("Enter a valid email address");
      }

      if (!opts.password || opts.password === "" || !passwordRegex.test(opts.password)) {
        throw new BadRequestError("A secure password must be more than 8 characters long and contains numeric and non-numeric characters");
      }

      // check if auth server exist already
      const serverExist = await authServerRepository.checkServerExist("email", email);
      
      if (serverExist) {
        throw new BadRequestError("Can't create an server twice, server exist already");
      }
      
      // hash password
      const hashedPwd = await bcrypt.hash(opts.password, 10);

      const server = await authServerRepository.createAuthServer({ name, email, password: hashedPwd });

      // generate signing key for new server
      await signingKeyRepository.issueSigningKeyToAuthServer(server._id, "server:read:write");
      // next I could send an email
      return server;
    } catch (error) {
      throw error;
    }
  }

  async issueSharedAccessTokenToUser(payload: { email: string, password: string}, serverId: string) {
    // authenticate the user if not authenticated
    const authUser = await userService.authenticateUser({ email: payload.email, password: payload.password });

    // user, server, hydratedServer
    const user = await userService.requestUserInfo(authUser.id);
    const server = await authServerRepository.retrieveServerData(serverId);
    const signingKeyData = await signingKeyRepository.retrieveSigningKeyForServer(serverId);
    const hydratedServer: HydratedServer = {
      id: server!._id,
      name: server!.name,
      scope: signingKeyData.scope,
      serverSigningKey: signingKeyData.key
    }
    const sharedAccessToken = await authServerRepository.issueSharedAccessTokenToUser(user, hydratedServer)
    return sharedAccessToken.sharedAccessToken;
  }
}