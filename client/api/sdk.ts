import { AxiosInstance } from "axios";

import * as User from './endpoints/user';
import * as Pool from './endpoints/pool';
import * as Transaction from './endpoints/transaction';

export const createApiSdk = (client: AxiosInstance) => {
    return {
        user: {
            getUser: User.getUser(client),
            searchUser: User.searchUser(client),
            createFriendRequest: User.createFriendRequest(client),
            deleteFriendRequest: User.deleteFriendRequest(client),
            acceptFriendRequest: User.acceptFriendRequest(client),
        },
        pool: {
            getPools: Pool.getPools(client),
            createPool: Pool.createPool(client),
            deletePool: Pool.deletePool(client),
            addMember: Pool.addMember(client),
            removeMember: Pool.removeMember(client),
        },
        transaction: {
            getTransactions: Transaction.getTransactions(client),
            createTransaction: Transaction.createTransaction(client),
            deleteTransaction: Transaction.deleteTransaction(client),
        },
    };
}

export type Sdk = ReturnType<typeof createApiSdk>;