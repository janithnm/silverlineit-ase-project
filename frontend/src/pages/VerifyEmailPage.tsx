import { Box, Card, CardContent, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVerifyEmail } from '../hooks/useAuth';
import Logo from '../components/common/Logo';

export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const verify = useVerifyEmail();

    useEffect(() => {
        if (token) verify.mutate(token);
    }, [token]);

    return (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default">
            <Card sx={{ width: '100%', maxWidth: 420, mx: 2 }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box display="flex" justifyContent="center" mb={3}>
                        <Logo size="md" />
                    </Box>

                    {verify.isPending && (
                        <>
                            <CircularProgress sx={{ mb: 2 }} />
                            <Typography>Verifying your email...</Typography>
                        </>
                    )}

                    {verify.isSuccess && (
                        <>
                            <CheckCircleOutlineIcon sx={{ fontSize: 56, color: 'success.main', mb: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 700 }} mb={1}>Email Verified!</Typography>
                            <Typography color="text.secondary" mb={3}>Your account is now active.</Typography>
                            <Button variant="contained" fullWidth onClick={() => navigate('/login')}>
                                Go to Login
                            </Button>
                        </>
                    )}

                    {verify.isError && (
                        <>
                            <ErrorOutlineIcon sx={{ fontSize: 56, color: 'error.main', mb: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 700 }} mb={1}>Verification Failed</Typography>
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {(verify.error as Error)?.message || 'Invalid or expired token.'}
                            </Alert>
                            <Button variant="outlined" fullWidth onClick={() => navigate('/login')}>
                                Back to Login
                            </Button>
                        </>
                    )}

                    {!token && (
                        <Typography color="text.secondary">No verification token found in URL.</Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}