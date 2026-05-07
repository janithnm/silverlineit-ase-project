import {
    AppBar, Toolbar, Box, Button, IconButton,
    Menu, MenuItem, Avatar, Typography, Divider
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadIcon from '@mui/icons-material/Upload';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Logo from '../common/Logo';
import { useLogout } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Upload', path: '/upload', icon: <UploadIcon fontSize="small" /> },
    { label: 'Library', path: '/library', icon: <LibraryBooksIcon fontSize="small" /> },
];

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useLogout();
    const user = authService.getCurrentUser();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleMenuClose();
        logout.mutate();
    };

    return (
        <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Logo */}
                <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                    <Logo size="sm" />
                </Box>

                {/* Nav Links */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.path}
                            startIcon={item.icon}
                            onClick={() => navigate(item.path)}
                            color={location.pathname === item.path ? 'primary' : 'inherit'}
                            variant={location.pathname === item.path ? 'contained' : 'text'}
                            size="small"
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>

                {/* User Menu */}
                <Box>
                    <IconButton onClick={handleMenuOpen}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34, fontSize: 14 }}>
                            {user?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <Box sx={{ px: 2, py: 1 }}>
                            <Typography sx={{ fontWeight: 600 }}>{user?.username}</Typography>
                            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}