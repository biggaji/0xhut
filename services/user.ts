import { CreateUserOption } from "../types/sharedTypes.js";
import { BadRequestError, BadUserInputError } from "../@commons/errorHandlers.js";
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
        throw new BadUserInputError("FirstName is required");
      }

      if (!lastName || lastName === "") {
        throw new BadUserInputError("lastName is required");
      }

      if (!email || email === "" || !emailRegex.test(email)) {
        throw new BadUserInputError("Enter a valid email address");
      }

      if (!opts.password || opts.password === "" || !passwordRegex.test(opts.password)) {
        throw new BadUserInputError("A secure password must be more than 8 characters long and contains numeric and non-numeric characters");
      }

      
      if (dob) {
        if (dob === "" || !(new Date(dob) instanceof Date)) {
          throw new BadUserInputError("Enter a valid date format");
        }
      }

      if (country) {
        if (country === "") {
          throw new BadUserInputError("Enter a valid country name");
        }
      }

      if (languages) {
        if (languages.length === 0) {
          throw new BadUserInputError("Choose valid spoken languages");
        }
      }

      // done with validation
      // check if user exist already
      const userExist = await userRepository.checkUserExist(email);
      
      if (userExist) {
        throw new BadRequestError("Can't create an account twice, user exist already");
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

  async requestUserInfo(id: string) {
    try {
      
    } catch (error) {
      throw error;
    }
  }
}