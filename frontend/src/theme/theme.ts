import type { Theme } from '@emotion/react';
import { createTheme } from '@mui/material/styles';

const theme: Theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1A3C8F',
            light: '#2d5abf',
            dark: '#102660',
            contrastText: '#ffffff',
        },
        error: {
            main: '#E63329',
            light: '#ff6b5b',
            dark: '#b71c1c',
        },
        background: {
            default: '#f4f6f9',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a2e',
            secondary: '#5a6a85',
        },
    },
    typography: {
        fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontSize: '0.95rem',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #1A3C8F 0%, #2d5abf 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #102660 0%, #1A3C8F 100%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 600,
                },
            },
        },
    },
});

export default theme;