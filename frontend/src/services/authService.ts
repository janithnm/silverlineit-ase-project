import { authApi } from '../api/authApi';
import { authStore } from '../store/authStore';
import type { User } from '../types';

export const authService = {
    async register(username: string, email: string, password: string): Promise<void> {
        await authApi.register({ username, email, password });
    },

    async login(email: string, password: string): Promise<User> {
        const { data } = await authApi.login({ email, password });
        const { accessToken, refreshToken, user } = data.data;
        authStore.setSession(accessToken, refreshToken, user);
        return user;
    },

    async logout(): Promise<void> {
        const refreshToken = authStore.getRefreshToken();
        try {
            if (refreshToken) await authApi.logout(refreshToken);
        } finally {
            authStore.clearSession();
        }
    },

    async verifyEmail(token: string): Promise<string> {
        const { data } = await authApi.verifyEmail(token);
        return data.message;
    },

    async resendVerification(email: string): Promise<string> {
        const { data } = await authApi.resendVerification(email);
        return data.message;
    },

    getCurrentUser: (): User | null => authStore.getUser(),
    isAuthenticated: (): boolean => authStore.isAuthenticated(),
};