"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionDeleteTransactionEndpoint = exports.transactionCreateTransactionEndpoint = exports.transactionGetTransactionsEndpoint = exports.poolRemoveMemberEndpoint = exports.poolAddMemberEndpoint = exports.poolDeletePoolEndpoint = exports.poolCreatePoolEndpoint = exports.poolGetPoolEndpoint = exports.userDeleteFriendRequestEndpoint = exports.userAcceptFriendRequestEndpoint = exports.userCreateFriendRequestEndpoint = exports.userSearchUserEndpoint = exports.userGetUserEndpoint = exports.authInvalidateTokensEndpoint = exports.authRefreshEndpoint = exports.authSignInEndpoint = exports.authCreateUserEndpoint = exports.authDoesUserExistEndpoint = void 0;
//#region Auth
exports.authDoesUserExistEndpoint = '/auth/doesUserExist';
exports.authCreateUserEndpoint = '/auth/createUser';
exports.authSignInEndpoint = '/auth/signIn';
exports.authRefreshEndpoint = '/auth/refresh';
exports.authInvalidateTokensEndpoint = '/auth/invalidateTokens';
//#endregion
//#region User
exports.userGetUserEndpoint = '/user/getUser';
exports.userSearchUserEndpoint = '/user/searchUser';
exports.userCreateFriendRequestEndpoint = '/user/createFriendRequest';
exports.userAcceptFriendRequestEndpoint = '/user/acceptFriendRequest';
exports.userDeleteFriendRequestEndpoint = '/user/deleteFriendRequest';
//#endregion
//#region Pool
exports.poolGetPoolEndpoint = '/pool/getPool';
exports.poolCreatePoolEndpoint = '/pool/createPool';
exports.poolDeletePoolEndpoint = '/pool/deletePool';
exports.poolAddMemberEndpoint = '/pool/addMember';
exports.poolRemoveMemberEndpoint = '/pool/removeMember';
//#endregion
//#region Transaction
exports.transactionGetTransactionsEndpoint = '/transaction/getTransactions';
exports.transactionCreateTransactionEndpoint = '/transaction/createTransaction';
exports.transactionDeleteTransactionEndpoint = '/transaction/deleteTransaction';
//#endregion
