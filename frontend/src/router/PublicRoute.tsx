import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

export default function PublicRoute(): JSX.Element {
    return authService.isAuthenticated()
        ? <Navigate to="/dashboard" replace />
        : <Outlet />;
}