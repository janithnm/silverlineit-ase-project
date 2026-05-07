import { jwtDecode } from 'jwt-decode';
import type { User } from '../types';

interface JwtPayload {
    exp: number;
    sub: string;
}

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

export const authStore = {
    getAccessToken: (): string | null => localStorage.getItem(TOKEN_KEY),
    getRefreshToken: (): string | null => localStorage.getItem(REFRESH_KEY),
    getUser: (): User | null => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) as User : null;
    },

    setSession: (accessToken: string, refreshToken: string, user: User): void => {
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    clearSession: (): void => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
    },

    isAuthenticated: (): boolean => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return false;
        try {
            const { exp } = jwtDecode<JwtPayload>(token);
            return exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },
};