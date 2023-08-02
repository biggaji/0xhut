import { CreateUserOption, HydratedUser } from "../types/sharedTypes.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../@commons/errorHandlers.js";
import * as bcrypt from "bcryptjs";
import UserRepository from "../repositories/users.js";

const userRepository = new UserRepository();

/**
 * @class UserService
 */

export default class UserService {
  constructor() {}

  async createUser(opts: CreateUserOption) {
    try {
      const { firstName, lastName, email, dob, country, languages } = opts;
      // validate opts ||
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      
      if (!firstName || firstName === "") {
        throw new BadRequestError("FirstName is required");
      }

      if (!lastName || lastName === "") {
        throw new BadRequestError("lastName is required");
      }

      if (!email || email === "" || !emailRegex.test(email)) {
        throw new BadRequestError("Enter a valid email address");
      }

      if (!opts.password || opts.password === "" || !passwordRegex.test(opts.password)) {
        throw new BadRequestError("A secure password must be more than 8 characters long and contains numeric and non-numeric characters");
      }

      
      if (dob) {
        if (dob === "" || !(new Date(dob) instanceof Date)) {
          throw new BadRequestError("Enter a valid date format");
        }
      }

      if (country) {
        if (country === "") {
          throw new BadRequestError("Enter a valid country name");
        }
      }

      if (languages) {
        if (languages.length === 0) {
          throw new BadRequestError("Choose valid spoken languages");
        }
      }

      // done with validation
      // check if user exist already
      const userExist = await userRepository.checkUserExist(email);
      
      if (userExist) {
        throw new ForbiddenError("Can't create an account twice, user exist already");
      }     
      // user doesn't have an account
      // hash password

      const hashedPwd = await bcrypt.hash(opts.password, 10);

      const account = await userRepository.createUser({ firstName, lastName, email, dob, languages, country, password: hashedPwd });

      // next I could send an email
      return account;
    } catch (error) {
      throw error;
    }
  }

  async authenticateUser(opts: { email: string, password: string }) {
    try {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!opts.email || opts.email === "" || !emailRegex.test(opts.email)) {
        throw new BadRequestError("Enter a valid email address");
      }

      const userExist = await userRepository.checkUserExist(opts.email);
      if (!userExist) {
        throw new NotFoundError(`User with email ' ${opts.email} ' not found`);
      }

      const user = await userRepository.requestUserInfo("email", opts.email);

      // validate password
      const passwordIsValid = await bcrypt.compare(opts.password, user!.password);

      if (!passwordIsValid) {
        throw new BadRequestError("Invalid credentials");
      }

      // return an Hydrated user object to be used for tokenization
      const hydratedUser: HydratedUser = {
        id: user?._id,
        firstName: user!.firstName,
        lastName: user!.lastName,
        email: user!.email
      };

      return hydratedUser;
    } catch (error) {
      throw error;
    }
  }

  async requestUserInfo(id: string) {
    try {
      const user = await userRepository.requestUserInfo("id", id);
      
      if (!user) {
        throw new NotFoundError(`User with id '${id}' not found`);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}