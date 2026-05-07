import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute(): JSX.Element {
    return authService.isAuthenticated()
        ? <Outlet />
        : <Navigate to="/login" replace />;
}