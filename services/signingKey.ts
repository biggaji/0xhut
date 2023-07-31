// import { CreateAuthServerOption } from "../types/sharedTypes.js";
// import { BadRequestError, BadUserInputError } from "../@commons/errorHandlers.js";
// import * as bcrypt from "bcryptjs";
// import AuthServerRepository from "../repositories/authServer.js";
// import SigningKeyRepository from "../repositories/signingKey.js";

// const authServerRepository = new AuthServerRepository();
// const signingKeyRepository = new SigningKeyRepository();

// /**
//  * @class AuthServerService
//  */

// export default class AuthServerService {
//   constructor() {}

//   async createServer(opts: CreateAuthServerOption) {
//     try {
//       const { name, email } = opts;
//       // validate opts ||
//       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//       const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      
//       if (!name || name === "") {
//         throw new BadUserInputError("A server name is required");
//       }

//       if (!email || email === "" || !emailRegex.test(email)) {
//         throw new BadUserInputError("Enter a valid email address");
//       }

//       if (!opts.password || opts.password === "" || !passwordRegex.test(opts.password)) {
//         throw new BadUserInputError("A secure password must be more than 8 characters long and contains numeric and non-numeric characters");
//       }

//       // check if auth server exist already
//       const serverExist = await authServerRepository.checkServerExist("email", email);
      
//       if (serverExist) {
//         throw new BadRequestError("Can't create an server twice, server exist already");
//       }
      
//       // hash password
//       const hashedPwd = await bcrypt.hash(opts.password, 10);

//       const server = await authServerRepository.createAuthServer({ name, email, password: hashedPwd });

//       // generate signing key for new server
//       const generateSigningKey = await signingKeyRepository.issueSigningKeyToAuthServer((server._id).toString(), "server:read:write");
//       // next I could send an email
//       return server;
//     } catch (error) {
//       throw error;
//     }
//   }
// }