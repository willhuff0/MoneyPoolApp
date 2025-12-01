import { Pool, Transaction, User } from "./json";
export interface ErrorResponse {
    code?: number;
    message: string;
}
export declare const authDoesUserExistEndpoint = "/auth/doesUserExist";
export interface AuthDoesUserExistRequest {
    email?: string;
    userName?: string;
}
export interface AuthDoesUserExistResponse {
    userExists: boolean;
}
export declare const authCreateUserEndpoint = "/auth/createUser";
export interface AuthCreateUserRequest {
    email: string;
    userName: string;
    displayName: string;
    password: string;
}
export interface AuthCreateUserResponse {
    refreshToken: string;
    sessionToken: string;
    user: {
        userId: string;
        chompScore: number;
    };
}
export declare const authSignInEndpoint = "/auth/signIn";
export interface AuthSignInRequest {
    email?: string;
    userName?: string;
    password: string;
}
export interface AuthSignInResponse {
    refreshToken: string;
    sessionToken: string;
    user: {
        userId: string;
        email: string;
        userName: string;
        displayName: string;
        chompScore: number;
        pools: string[];
        friends: string[];
        incomingFriendRequests: string[];
    };
}
export declare const authRefreshEndpoint = "/auth/refresh";
export interface AuthRefreshRequest {
    refreshToken: string;
}
export interface AuthRefreshResponse {
    refreshToken?: string;
    sessionToken: string;
}
export declare const authInvalidateTokensEndpoint = "/auth/invalidateTokens";
export interface AuthInvalidateTokensRequest {
    email?: string;
    userName?: string;
    password: string;
}
export declare const userGetUserEndpoint = "/user/getUser";
export interface UserGetUserRequest {
    userId?: string;
}
export interface UserGetUserResponse {
    user: User;
}
export interface UserGetSelfUserResponse {
    user: {
        userId: string;
        email: string;
        userName: string;
        displayName: string;
        chompScore: number;
        pools: string[];
        friends: string[];
        incomingFriendRequests: string[];
    };
}
export declare const userEditUserEndpoint = "/user/editUser";
export interface UserEditUserRequest {
    newDisplayName?: string;
    newEmail?: string;
    newPassword?: string;
}
export declare const userSearchUserEndpoint = "/user/searchUser";
export interface UserSearchUserRequest {
    query: string;
    start?: number;
    limit?: number;
}
export interface UserSearchUserResponse {
    users: User[];
}
export declare const userCreateFriendRequestEndpoint = "/user/createFriendRequest";
export interface UserCreateFriendRequestRequest {
    otherUserId: string;
}
export declare const userAcceptFriendRequestEndpoint = "/user/acceptFriendRequest";
export interface UserAcceptFriendRequestRequest {
    otherUserId: string;
}
export declare const userDeleteFriendRequestEndpoint = "/user/deleteFriendRequest";
export interface UserDeleteFriendRequestRequest {
    otherUserId: string;
}
export declare const poolGetPoolsEndpoint = "/pool/getPools";
export interface PoolGetPoolsRequest {
    poolIds: string[];
}
export interface PoolGetPoolsResponse {
    pools: Pool[];
}
export declare const poolCreatePoolEndpoint = "/pool/createPool";
export interface PoolCreatePoolRequest {
    name: string;
}
export interface PoolCreatePoolResponse {
    poolId: string;
}
export declare const poolDeletePoolEndpoint = "/pool/deletePool";
export interface PoolDeletePoolRequest {
    poolId: string;
}
export declare const poolAddMemberEndpoint = "/pool/addMember";
export interface PoolAddMemberRequest {
    poolId: string;
    userId: string;
}
export declare const poolRemoveMemberEndpoint = "/pool/removeMember";
export interface PoolRemoveMemberRequest {
    poolId: string;
    userId: string;
}
export declare const transactionGetTransactionsEndpoint = "/transaction/getTransactions";
export interface TransactionGetTransactionsRequest {
    poolId: string;
    start?: number;
    limit?: number;
}
export interface TransactionGetTransactionsResponse {
    transactions: Transaction[];
}
export declare const transactionCreateTransactionEndpoint = "/transaction/createTransaction";
export interface TransactionCreateTransactionRequest {
    poolId: string;
    amount: number;
    description: string;
}
export interface TransactionCreateTransactionResponse {
    transactionId: string;
}
export declare const transactionDeleteTransactionEndpoint = "/transaction/deleteTransaction";
export interface TransactionDeleteTransactionRequest {
    transactionId: string;
}
//# sourceMappingURL=protocol.d.ts.map