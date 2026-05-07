import { Box, Container } from '@mui/material';
import type { ReactNode } from 'react';

interface PageWrapperProps {
    children: ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function PageWrapper({ children, maxWidth = 'lg' }: PageWrapperProps) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 8 }}>
            <Container maxWidth={maxWidth}>
                {children}
            </Container>
        </Box>
    );
}