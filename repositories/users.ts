import { UserModel as User } from "../models/users.model.js";
import { CreateUserOption } from "../types/sharedTypes.js";

/**
 * @class UserRepository
 */

export default class UserRepository {
  constructor() {}

  async createUser(opts: CreateUserOption) {
    try {
      const { firstName, lastName, email, dob, country, languages, password } = opts;

      const account = new User({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        languages: languages ?? [], //using the nullish coarsing technique
        country: country ?? undefined,
        dob: dob ?? undefined
      });

      // persist the new account
      await account.save();
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

  async checkUserExist(email: string) {
    try {
      let response = false;
      const user = await User.findOne({ email: email });
      if (user?._id) {
        response = true;
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}