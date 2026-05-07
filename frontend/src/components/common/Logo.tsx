import { Typography, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const iconSize = size === 'sm' ? 24 : size === 'md' ? 32 : 48;
    const variant = size === 'sm' ? 'h6' : size === 'md' ? 'h5' : 'h4';

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
        }}
        >
            <CloudUploadIcon sx={{ fontSize: iconSize, color: 'primary.main' }} />
            <Typography variant={variant} sx={{ fontWeight: 700 }} color="primary.main">
                CourseVault
            </Typography>
        </Box>
    );
}