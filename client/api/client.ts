import axios, { AxiosError, AxiosInstance } from 'axios';
import { getSessionToken, getRefreshToken, saveTokens } from './tokens';

import { AuthRefreshRequest, AuthRefreshResponse, authRefreshEndpoint } from '@money-pool-app/shared';

let refreshPromise: Promise<void> | null = null;

const createApiClient = (baseUrl: string): AxiosInstance => {
    const client = axios.create({ baseURL: baseUrl, timeout: 15000 });

    client.interceptors.request.use((config) => {
        const token = getSessionToken();
        if (token != undefined) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    client.interceptors.response.use((r) => r,
        async (error: AxiosError) => {
            const original = error.config as any;
            if (original == undefined || original._retry) throw error;
            const status = error.response?.status;

            if (status === 401) {
                original._retry = true;

                refreshPromise ??= (async () => {
                    const oldRefreshToken = getRefreshToken();
                    if (oldRefreshToken == undefined) throw error;

                    try {
                        const response = await axios.post<AuthRefreshResponse>(`${client.defaults.baseURL}${authRefreshEndpoint}`, {
                            refreshToken: oldRefreshToken,
                        } as AuthRefreshRequest);
                        const { refreshToken, sessionToken } = response.data;
                        await saveTokens({
                            refreshToken: refreshToken ?? oldRefreshToken,
                            sessionToken: sessionToken,
                        });
                    } catch (e) {
                        throw e;
                    }
                })().finally(() => { refreshPromise = null; });

                await refreshPromise;
                return client(original);
            }

            throw error;
        }
    );

    return client;
}

export const apiClient = createApiClient(process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080');