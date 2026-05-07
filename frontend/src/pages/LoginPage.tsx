import {
    Box, Card, CardContent, TextField,
    Button, Typography, Alert, Link, Divider
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import Logo from '../components/common/Logo';

export default function LoginPage() {
    const navigate = useNavigate();
    const login = useLogin();

    const [form, setForm] = useState({ email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login.mutate(form);
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
            <Card sx={{ width: '100%', maxWidth: 420, mx: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }} >
                        <Logo size="md" />
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center", mb: 0.5 }} >
                        Welcome back
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", mb: 3 }} >
                        Sign in to your account
                    </Typography>

                    {login.isError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {(login.error as Error)?.message ?? 'Login failed. Please try again.'}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            fullWidth
                            autoComplete="email"
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            fullWidth
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={login.isPending}
                        >
                            {login.isPending ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" sx={{ textAlign: "center" }}>
                        Don't have an account?{' '}
                        <Link component="button" onClick={() => navigate('/register')} sx={{ fontWeight: 600 }}>
                            Register
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box >
    );
}