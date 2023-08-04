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

interface CreateSharedAccessTokenOption {
  user: UserDocument,
  hydratedServer: HydratedServer
}

interface HydratedServer {
  scope: any,
  name: string,
  id: any,
  serverSigningKey: string
}

interface HydratedUser {
  firstName: string,
  lastName: string,
  email: string,
  id: any,
}

interface UserDocument {
  _id: any
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

interface AuthServerDocument {
  _id: any,
  name: string,
  email: string,
  password: string,
  createdAt: Date,
  updatedAt: Date
}

interface SigningKeyDocument {
  key: string,
  _id: any,
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
  INTERNAL_SERVER_ERROR="INTERNAL_SERVER_ERROR",
}

export { CreateAuthServerOption, CreateUserOption, AuthServerDocument, SigningKeyDocument, SigningKeyScope, SharedAccessToken, ErrorCodeName, CreateSharedAccessTokenOption, HydratedServer, UserDocument, HydratedUser };