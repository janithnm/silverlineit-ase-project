import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const useLogin = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            authService.login(email, password),
        onSuccess: () => navigate('/dashboard'),
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) =>
            authService.register(username, email, password),
    });
};

export const useLogout = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => navigate('/login'),
    });
};

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: (token: string) => authService.verifyEmail(token),
    });
};

export const useResendVerification = () => {
    return useMutation({
        mutationFn: (email: string) => authService.resendVerification(email),
    });
};