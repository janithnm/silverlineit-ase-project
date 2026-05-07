import type { ApiResponse, AuthTokens } from '../types';
import type { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';

export const authApi = {
    register: (data: { username: string; email: string; password: string }): Promise<AxiosResponse<ApiResponse<null>>> =>
        axiosInstance.post('/auth/register', data),

    login: (data: { email: string; password: string }): Promise<AxiosResponse<ApiResponse<AuthTokens>>> =>
        axiosInstance.post('/auth/login', data),

    refresh: (refreshToken: string): Promise<AxiosResponse<ApiResponse<AuthTokens>>> =>
        axiosInstance.post('/auth/refresh', { refreshToken }),

    logout: (refreshToken: string): Promise<AxiosResponse<ApiResponse<null>>> =>
        axiosInstance.post('/auth/logout', { refreshToken }),

    verifyEmail: (token: string): Promise<AxiosResponse<ApiResponse<null>>> =>
        axiosInstance.get(`/auth/verify-email?token=${token}`),

    resendVerification: (email: string): Promise<AxiosResponse<ApiResponse<null>>> =>
        axiosInstance.post(`/auth/resend-verification?email=${email}`),
};