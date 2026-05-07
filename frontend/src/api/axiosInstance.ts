import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { authStore } from '../store/authStore';

interface QueueItem {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach access token
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = authStore.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: unknown) => Promise.reject(error)
);

// Response interceptor — handle 401, attempt refresh
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token!);
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        const axiosError = error as {
            config: InternalAxiosRequestConfig & { _retry?: boolean };
            response?: {
                status: number;
                data?: {
                    message?: string;
                    errors?: Array<{ field: string; message: string }>;
                };
            };
        };

        const originalRequest = axiosError.config;
        const status = axiosError.response?.status;

        // --- Token refresh logic (401 only) ---
        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err: unknown) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = authStore.getRefreshToken();

            if (!refreshToken) {
                authStore.clearSession();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    { refreshToken }
                );

                const newToken = data.data.accessToken as string;
                authStore.setSession(newToken, data.data.refreshToken, data.data.user);

                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError: unknown) {
                processQueue(refreshError, null);
                authStore.clearSession();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // --- Extract backend error message from ApiResponse envelope ---
        const body = axiosError.response?.data;
        if (body?.message) {
            // If there are field-level validation errors, append them
            const fieldDetails = body.errors
                ?.map((e) => `${e.field}: ${e.message}`)
                .join(', ');
            const fullMessage = fieldDetails
                ? `${body.message} — ${fieldDetails}`
                : body.message;
            return Promise.reject(new Error(fullMessage));
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;