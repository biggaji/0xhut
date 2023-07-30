/** 
 * @class ErrorHelper
 * @description Intercerpts and re-formats the error object into a clean readable response for the client and abstract away any internal error details
*/


export default class ErrorHelper {
  static ProcessError(error:any) {
    switch(error.code) {
      case 400:
      case 401:
      case 403:
      case 404:
        return {
          success: false,
          message: error.message,
          code: error.code,
          codeName: error.codeName
        }
        
      default: 
        return {
          success: false,
          message: `An error occurred on our server while processing your request, try again later`,
          code: error.code,
          codeName: error.codeName
        }
    }
  }
}