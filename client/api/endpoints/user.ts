import * as Protocol from "@money-pool-app/shared";
import { AxiosInstance } from "axios";

export const getUser = (client: AxiosInstance) => async (userId: string): Promise<Protocol.User | null> => {
    const response = await client.post(Protocol.userGetUserEndpoint, {
        userId: userId,
    } as Protocol.UserGetUserRequest);
    if (response.status !== 200) return null;

    const body = response.data as Protocol.UserGetUserResponse;
    return body.user;
}

export const searchUser = (client: AxiosInstance) => async (userName: string): Promise<Protocol.User | null> => {
    const response = await client.post(Protocol.userSearchUserEndpoint, {
        query: userName,
    } as Protocol.UserSearchUserRequest);
    if (response.status !== 200) return null;

    const body = response.data as Protocol.UserSearchUserResponse;
    return body.users[0];
}

export const createFriendRequest = (client: AxiosInstance) => async (otherUserId: string): Promise<boolean> => {
    const response = await client.post(Protocol.userCreateFriendRequestEndpoint, {
        otherUserId: otherUserId,
    } as Protocol.UserCreateFriendRequestRequest);
    return response.status === 200;
}

export const deleteFriendRequest = (client: AxiosInstance) => async (otherUserId: string): Promise<boolean> => {
    const response = await client.post(Protocol.userDeleteFriendRequestEndpoint, {
        otherUserId: otherUserId,
    } as Protocol.UserDeleteFriendRequestRequest);
    return response.status === 200;
}

export const acceptFriendRequest = (client: AxiosInstance) => async (otherUserId: string): Promise<boolean> => {
    const response = await client.post(Protocol.userAcceptFriendRequestEndpoint, {
        otherUserId: otherUserId,
    } as Protocol.UserAcceptFriendRequestRequest);
    return response.status === 200;
}