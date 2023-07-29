interface CreateUserOption {
  firstName: string,
  lastName: string,
  email: string,
  dob: string,
  password: string,
  country?: string,
  languages?: string[]
}

interface CreateAuthServerOption {
  name: string,
  email: string,
  password: string
}

interface User {
  firstName: string,
  lastName: string,
  email: string,
  dob: string,
  password: string,
  country?: string,
  languages?: string[],
  createdAt: Date,
  updatedAt: Date
}

interface AuthServer {
  name: string,
  email: string,
  password: string,
  signingKey: SigningKey,
  createdAt: Date,
  updatedAt: Date
}

interface SigningKey {
  key: string,
  scope: SigningKeyScope,
  revoked: boolean,
  revokedAt: Date,
  createdAt: Date,
  updatedAt: Date
}

interface SharedAccessToken {
  sharedAccessToken: string
}

type SigningKeyScope = "server:read" | "server:write" | "server:read:write";

enum ErrorCodeName {
  UNAUTHORIZED="UNAUTHORIZED",
  FORBIDDEN="FORBIDDEN",
  UNAUTHENTICATED="UNAUTHENTICATED",
  NOT_FOUND="NOT_FOUND",
  BAD_REQUEST="BAD_REQUEST",
  BAD_USER_INPUT="BAD_USER_INPUT",
  INTERNAL_SERVER_ERROR="INTERNAL_SERVER_ERROR",
}

export { CreateAuthServerOption, CreateUserOption, User, AuthServer, SigningKey, SigningKeyScope, SharedAccessToken, ErrorCodeName };