import SigningKeyRepository from "../repositories/signingKey.js";
const signingKeyRepository = new SigningKeyRepository();

/**
 * @class SigningKeyService
 */

export default class SigningKeyService {
  constructor() {}

  async validateSigningKey(key: string) {
    try {
      return await signingKeyRepository.validateSigningKey(key);
    } catch (error) {
      throw error;
    }
  }
  
  // async requestNewSigningKeyForServer(serverId: string) {
  //   // find and revoke old signing key
  //   // issue` a new one
  // }
}