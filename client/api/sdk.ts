import { AxiosInstance } from "axios";

import * as User from './endpoints/user';

export const createApiSdk = (client: AxiosInstance) => {
    return {
        user: {
            getUser: User.getUser(client),
            searchUser: User.searchUser(client),
            createFriendRequest: User.createFriendRequest(client),
            deleteFriendRequest: User.deleteFriendRequest(client),
            acceptFriendRequest: User.acceptFriendRequest(client),
        },
    };
}

export type Sdk = ReturnType<typeof createApiSdk>;