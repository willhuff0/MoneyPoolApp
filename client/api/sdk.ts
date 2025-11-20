import { AxiosInstance } from "axios";

import * as User from './endpoints/user';
import * as Pool from './endpoints/pool';

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
            getPool: Pool.getPool(client),
            createPool: Pool.createPool(client),
            deletePool: Pool.deletePool(client),
            addMember: Pool.addMember(client),
            removeMember: Pool.removeMember(client),
        },
        transaction: {
            
        },
    };
}

export type Sdk = ReturnType<typeof createApiSdk>;