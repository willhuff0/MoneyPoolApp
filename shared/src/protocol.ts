import { Pool, User } from "./json";

export interface ErrorResponse {
    code?: number,
    message: string,
}

//#region Auth

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

//#endregion

//#region User

export const userGetUserEndpoint = '/user/getUser';
export interface UserGetUserRequest {
    userId: string,
}
export interface UserGetUserResponse {
    user: User,
}

export const userSearchUserEndpoint = '/user/searchUser';
export interface UserSearchUserRequest {
    query: string,
    start?: number,
    limit?: number,
}
export interface UserSearchUserResponse {
    users: User[],
}

export const userCreateFriendRequestEndpoint = '/user/createFriendRequest';
export interface UserCreateFriendRequestRequest {
    otherUserId: string,
}

export const userAcceptFriendRequestEndpoint = '/user/acceptFriendRequest';
export interface UserAcceptFriendRequestRequest {
    otherUserId: string,
}

export const userDeleteFriendRequestEndpoint = '/user/deleteFriendRequest';
export interface UserDeleteFriendRequestRequest {
    otherUserId: string,
}

//#endregion

//#region Pool

export const poolGetPool = '/pool/getPool';
export interface PoolGetPoolRequest {
    poolId: string,
}
export interface PoolGetPoolResponse {
    pool: Pool,
}

export const poolCreatePool = '/pool/createPool';
export interface PoolCreatePoolRequest {
    name: string,
}
export interface PoolCreatePoolResponse {
    poolId: string,
}

export const poolAddUser = '/pool/addUser';
export interface PoolAddUserRequest {
    poolId: string,
    userId: string,
}

export const poolRemoveUser = '/pool/removeUser';
export interface PoolRemoveUserRequest {
    poolId: string,
    userId: string,
}

//#endregion
