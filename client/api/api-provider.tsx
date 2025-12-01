import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from './client';
import { loadTokens, saveTokens, clearTokens, getRefreshToken } from './tokens';
import { authCreateUserEndpoint, AuthCreateUserRequest, AuthCreateUserResponse, authDoesUserExistEndpoint, AuthDoesUserExistRequest, AuthDoesUserExistResponse, authInvalidateTokensEndpoint, AuthInvalidateTokensRequest, authSignInEndpoint, AuthSignInRequest, AuthSignInResponse, UserGetSelfUserResponse, userGetUserEndpoint, UserGetUserResponse } from '@money-pool-app/shared';
import { createApiSdk, Sdk } from './sdk';
import axios from 'axios';

type ActiveUser = {
    userId: string,
    userName: string,
    email: string,
    displayName: string,
    chompScore: number,
} | null;

type ApiContextType = {
    activeUser: ActiveUser,
    doesUserExist: (request: AuthDoesUserExistRequest) => Promise<boolean>,
    signIn: (request: AuthSignInRequest) => Promise<boolean>,
    signUp: (request: AuthCreateUserRequest) => Promise<boolean>,
    signOut: () => Promise<void>,
    signOutAll: (request: AuthInvalidateTokensRequest) => Promise<boolean>,
    ready: boolean,
    client: typeof apiClient,
    sdk: Sdk,
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeUser, setActiveUser] = useState<ActiveUser>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            await loadTokens();
            if (getRefreshToken() == undefined) {
                setReady(true);
                return;
            }
            try {
                const response = await apiClient.get<UserGetSelfUserResponse>(userGetUserEndpoint);
                if (response.status === 200) {
                    const { user } = response.data;
                    setActiveUser({
                        userId: user.userId,
                        userName: user.userName,
                        email: user.email,
                        displayName: user.displayName,
                        chompScore: user.chompScore,
                    });
                }
            } catch (error) {
                console.log(`Not logged in or session expired: ${error}`);
                await clearTokens();
            } finally {
                setReady(true);
            }
        })();
    }, []);

    const sdk = createApiSdk(apiClient);

    const value = useMemo<ApiContextType>(() => ({
        activeUser, ready, client: apiClient, sdk,
        doesUserExist: async (request) => {
            try {
                const response = await axios.post<AuthDoesUserExistResponse>(`${apiClient.defaults.baseURL}${authDoesUserExistEndpoint}`, request);
                if (response.status !== 200) return false;

                return response.data.userExists;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        signIn: async (request) => {
            try {
                const response = await axios.post<AuthSignInResponse>(`${apiClient.defaults.baseURL}${authSignInEndpoint}`, request);
                if (response.status !== 200) return false;
                
                const { refreshToken, sessionToken, user } = response.data;
                await saveTokens({
                    refreshToken: refreshToken,
                    sessionToken: sessionToken,
                });
                setActiveUser({
                    userId: user.userId,
                    userName: user.userName,
                    email: user.email,
                    displayName: user.displayName,
                    chompScore: user.chompScore,
                });
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        signUp: async (request) => {
            try {
                const response = await axios.post<AuthCreateUserResponse>(`${apiClient.defaults.baseURL}${authCreateUserEndpoint}`, request);
                if (response.status !== 200) return false;

                const { refreshToken, sessionToken, user } = response.data;
                await saveTokens({
                    refreshToken: refreshToken,
                    sessionToken: sessionToken,
                });
                setActiveUser({
                    userId: user.userId,
                    userName: request.userName,
                    email: request.email,
                    displayName: request.displayName,
                    chompScore: user.chompScore,
                });
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        signOut: async () => {
            await clearTokens();
            setActiveUser(null);
        },
        signOutAll: async (request) => {
            try {
                const response = await axios.post(`${apiClient.defaults.baseURL}${authInvalidateTokensEndpoint}`, request);

                await clearTokens();
                setActiveUser(null);

                return response.status === 200;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
    }), [activeUser, ready]);

    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    )
}

export const useApi = () => {
    const context = useContext(ApiContext);
    if (context == undefined) throw new Error("useAuth must be used within <ApiProvider>");
    return context;
}

export const useSdk = () => {
    return useApi().sdk;
}