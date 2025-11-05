export interface ErrorResponse {
    code?: number,
    message: string,
}

export const authDoesUserExistEndpoint = '/auth/doesUserExist';
export interface AuthDoesUserExistRequest {
    email?: string,
    userName?: string,
}
export interface AuthDoesUserExistResponse {
    userExists: boolean,
}

export const authCreateUserEndpoint = '/auth/createUser';
export interface AuthCreateUserRequest {
    email: string,
    userName: string,
    displayName: string,
    password: string,
}
export interface AuthCreateUserResponse {
    refreshToken: string,
    sessionToken: string,
    user: {
        userId: string,
        chompScore: number,
    },
}

export const authSignInEndpoint = '/auth/signIn';
export interface AuthSignInRequest {
    email?: string,
    userName?: string,
    password: string,
}
export interface AuthSignInResponse {
    refreshToken: string,
    sessionToken: string,
    user: {
        userId: string,
        email: string,
        userName: string,
        displayName: string,
        chompScore: number,
    },
}

export const authRefreshEndpoint = '/auth/refresh';
export interface AuthRefreshRequest {
    refreshToken: string,
}
export interface AuthRefreshResponse {
    refreshToken?: string,
    sessionToken: string,
}

export const authInvalidateTokensEndpoint = '/auth/invalidateTokens';
export interface AuthInvalidateTokensRequest {
    email?: string,
    userName?: string,
    password: string,
}