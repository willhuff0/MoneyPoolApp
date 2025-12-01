import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from './client';
import { loadTokens, saveTokens, clearTokens, getRefreshToken } from './tokens';
import { authCreateUserEndpoint, AuthCreateUserRequest, AuthCreateUserResponse, authDoesUserExistEndpoint, AuthDoesUserExistRequest, AuthDoesUserExistResponse, authInvalidateTokensEndpoint, AuthInvalidateTokensRequest, authSignInEndpoint, AuthSignInRequest, AuthSignInResponse, userEditUserEndpoint, UserEditUserRequest, UserGetSelfUserResponse, userGetUserEndpoint, UserGetUserResponse } from '@money-pool-app/shared';
import { createApiSdk, Sdk } from './sdk';
import axios from 'axios';

type ActiveUser = {
    userId: string,
    userName: string,
    email: string,
    displayName: string,
    chompScore: number,
    pools: string[],
    friends: string[],
    incomingFriendRequests: string[],
} | null;

type ApiContextType = {
    activeUser: ActiveUser,
    doesUserExist: (request: AuthDoesUserExistRequest) => Promise<boolean>,
    signIn: (request: AuthSignInRequest) => Promise<boolean>,
    signUp: (request: AuthCreateUserRequest) => Promise<boolean>,
    signOut: () => Promise<void>,
    signOutAll: (request: AuthInvalidateTokensRequest) => Promise<boolean>,
    editUser: (request: UserEditUserRequest) => Promise<boolean>,
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
                        pools: user.pools,
                        friends: user.friends,
                        incomingFriendRequests: user.incomingFriendRequests,
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
                    pools: user.pools,
                    friends: user.friends,
                    incomingFriendRequests: user.incomingFriendRequests,
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
                    pools: [],
                    friends: [],
                    incomingFriendRequests: [],
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
        editUser: async (request) => {
            try {
                if (activeUser == null) return false;
                const response = await apiClient.post(userEditUserEndpoint, request);
                if (response.status !== 200) return false;
                if (activeUser == null) return false;
                setActiveUser({
                    userId: activeUser.userId,
                    userName: activeUser.userName,
                    email: request.newEmail ?? activeUser.email,
                    displayName: request.newDisplayName ?? activeUser.displayName,
                    chompScore: activeUser.chompScore,
                    pools: activeUser.pools,
                    friends: activeUser.friends,
                    incomingFriendRequests: activeUser.incomingFriendRequests,
                });
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
    }), [activeUser, ready]);

    return (
        <ApiContext.Provider value={value}>
            {value.ready ? children : LoadingScreen()}
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

import { View, ActivityIndicator, StyleSheet } from "react-native";

function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});