import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native';

const SESSION_KEY = 'session_token';
const REFRESH_KEY = 'refresh_token';

type Tokens = {
    sessionToken: string,
    refreshToken: string; 
};

let memory: Partial<Tokens> = {};

const getItemAsync = async (key: string): Promise<string | null> => {
    try {
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(key);
        } else {
            return await SecureStore.getItemAsync(key);
        }
    } catch (error) {
        console.error("Error saving token:", error);
        return null;
    }
}
const setItemAsync = async (key: string, value: string) => {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    } catch (error) {
        console.error("Error saving token:", error);
    }
}
const deleteItemAsync = async (key: string) => {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    } catch (error) {
        console.error("Error saving token:", error);
    }
}

export const loadTokens = async (): Promise<Partial<Tokens>> => {
    const [sessionToken, refreshToken] = await Promise.all([
       getItemAsync(SESSION_KEY),
       getItemAsync(REFRESH_KEY), 
    ]);
    return memory = {
        sessionToken: sessionToken ?? undefined,
        refreshToken: refreshToken ?? undefined,
    };
}

export const saveTokens = async (tokens: Tokens): Promise<void> => {
    memory = tokens;
    await Promise.all([
        setItemAsync(SESSION_KEY, tokens.sessionToken),
        setItemAsync(REFRESH_KEY, tokens.refreshToken),
    ]);
}

export const clearTokens = async (): Promise<void> => {
    memory = {};
    await Promise.all([
        deleteItemAsync(SESSION_KEY),
        deleteItemAsync(REFRESH_KEY),
    ]);
}

export const getSessionToken = (): string | undefined => memory.sessionToken;
export const getRefreshToken = (): string | undefined => memory.refreshToken;