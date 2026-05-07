import { Box, Grid, Card, CardContent, Typography, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UploadIcon from '@mui/icons-material/Upload';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import { useContentList } from '../hooks/useContent';
import { authService } from '../services/authService';
import { contentService } from '../services/contentService';
import type { ContentItem } from '../types';

export default function DashboardPage() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const { data } = useContentList(0, 5, null);

    const recentItems: ContentItem[] = data?.content ?? [];

    return (
        <>
            <Navbar />
            <PageWrapper>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Welcome back, {user?.username} 👋
                    </Typography>
                    <Typography color="text.secondary">
                        Here's a summary of your course content.
                    </Typography>
                </Box>

                {/* Stat Cards */}
                <Grid container sx={{ spacing: 3, mb: 4 }} >
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h3" sx={{ fontWeight: 700 }} color="primary">
                                    {data?.totalElements ?? 0}
                                </Typography>
                                <Typography color="text.secondary">Total Files</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/upload')}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <UploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                <Box>
                                    <Typography sx={{ fontWeight: 600 }}>Upload Content</Typography>
                                    <Typography variant="body2" color="text.secondary">Add new materials</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/library')}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <LibraryBooksIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                <Box>
                                    <Typography sx={{ fontWeight: 600 }}>Content Library</Typography>
                                    <Typography variant="body2" color="text.secondary">Browse all files</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Recent Uploads */}
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Uploads</Typography>
                        <Button size="small" onClick={() => navigate('/library')}>View All</Button>
                    </Box>
                    {recentItems.length === 0 ? (
                        <Card>
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <InsertDriveFileIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                                <Typography color="text.secondary">No content uploaded yet.</Typography>
                                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/upload')}>
                                    Upload Now
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        recentItems.map((item) => (
                            <Card key={item.id} sx={{ mb: 1 }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
                                    <InsertDriveFileIcon color="primary" />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {contentService.formatSize(item.fileSizeBytes)} · {new Date(item.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Chip label={item.fileType} size="small" />
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            </PageWrapper>
        </>
    );
}