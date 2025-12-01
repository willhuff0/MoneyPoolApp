import * as Protocol from "@money-pool-app/shared";
import { AxiosInstance } from "axios";

export const getPools = (client: AxiosInstance) => async (poolIds: string[]): Promise<Protocol.Pool[]> => {
    const response = await client.post(Protocol.poolGetPoolsEndpoint, {
        poolIds: poolIds,
    } as Protocol.PoolGetPoolsRequest);
    if (response.status !== 200) return [];

    const body = response.data as Protocol.PoolGetPoolsResponse;
    return body.pools;
}

export const createPool = (client: AxiosInstance) => async (name: string): Promise<string | null> => {
    const response = await client.post(Protocol.poolCreatePoolEndpoint, {
        name: name,
    } as Protocol.PoolCreatePoolRequest);
    if (response.status !== 200) return null;

    const body = response.data as Protocol.PoolCreatePoolResponse;
    return body.poolId;
}

export const deletePool = (client: AxiosInstance) => async (poolId: string): Promise<boolean> => {
    const response = await client.post(Protocol.poolDeletePoolEndpoint, {
        poolId: poolId,
    } as Protocol.PoolDeletePoolRequest);
    return response.status === 200;
}

export const addMember = (client: AxiosInstance) => async (poolId: string, userId: string): Promise<boolean> => {
    const response = await client.post(Protocol.poolAddMemberEndpoint, {
        poolId: poolId,
        userId: userId,
    } as Protocol.PoolAddMemberRequest);
    return response.status === 200;
}

export const removeMember = (client: AxiosInstance) => async (poolId: string, userId: string): Promise<boolean> => {
    const response = await client.post(Protocol.poolRemoveMemberEndpoint, {
        poolId: poolId,
        userId: userId,
    } as Protocol.PoolRemoveMemberRequest);
    return response.status === 200;
}