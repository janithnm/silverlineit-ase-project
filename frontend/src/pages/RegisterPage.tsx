import {
    Box, Card, CardContent, TextField,
    Button, Typography, Alert, Link, Divider
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import Logo from '../components/common/Logo';

export default function RegisterPage() {
    const navigate = useNavigate();
    const register = useRegister();

    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [localError, setLocalError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (form.password !== form.confirmPassword) {
            setLocalError('Passwords do not match.');
            return;
        }

        register.mutate(
            { username: form.username, email: form.email, password: form.password },
            { onSuccess: () => navigate('/login') }
        );
    };

    return (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default">
            <Card sx={{ width: '100%', maxWidth: 420, mx: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box display="flex" justifyContent="center" mb={3}>
                        <Logo size="md" />
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 700 }} textAlign="center" mb={0.5}>
                        Create an account
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                        Start uploading your course content
                    </Typography>

                    {(localError || register.isError) && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {localError || (register.error as Error)?.message || 'Registration failed.'}
                        </Alert>
                    )}

                    {register.isSuccess && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Account created! Please check your email to verify your account.
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
                        <TextField label="Username" name="username" value={form.username} onChange={handleChange} required fullWidth />
                        <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
                        <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth />
                        <TextField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required fullWidth />
                        <Button type="submit" variant="contained" fullWidth size="large" disabled={register.isPending}>
                            {register.isPending ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" textAlign="center">
                        Already have an account?{' '}
                        <Link component="button" onClick={() => navigate('/login')} sx={{ fontWeight: 600 }}>
                            Sign in
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}