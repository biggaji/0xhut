import { ErrorCodeName } from "../types/sharedTypes.js";

class BaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name;
  }
}

class BadRequestError extends BaseError {
  code: number;
  codeName: ErrorCodeName
  constructor(message: string) {
    super(message)
    this.code = 400
    this.codeName = ErrorCodeName.BAD_REQUEST
  }
}

class NotFoundError extends BaseError {
  code: number;
  codeName: ErrorCodeName
  constructor(message: string) {
    super(message)
    this.code = 404
    this.codeName = ErrorCodeName.NOT_FOUND
  }
}

class ForbiddenError extends BaseError {
  code: number;
  codeName: ErrorCodeName
  constructor(message: string) {
    super(message)
    this.code = 403
    this.codeName = ErrorCodeName.FORBIDDEN
  }
}

class UnAuthorizedError extends BaseError {
  code: number;
  codeName: ErrorCodeName
  constructor(message: string) {
    super(message)
    this.code = 401
    this.codeName = ErrorCodeName.UNAUTHORIZED
  }
}

class InternalServerError extends BaseError {
  code: number;
  codeName: ErrorCodeName
  constructor(message: string) {
    super(message)
    this.code = 500
    this.codeName = ErrorCodeName.INTERNAL_SERVER_ERROR
  }
}

export { InternalServerError, BadRequestError, UnAuthorizedError, ForbiddenError, NotFoundError };