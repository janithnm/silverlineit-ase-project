import {
    Box, Card, CardContent, Typography, Chip, IconButton,
    MenuItem, Select, FormControl, InputLabel, Pagination,
    Tooltip, CircularProgress, Alert, Button,
    type SelectChangeEvent
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import { useContentList, useDeleteContent, useDownloadContent } from '../hooks/useContent';
import type { ContentItem } from '../types';

const FILE_TYPE_OPTIONS = ['', 'PDF', 'MP4', 'JPG', 'JPEG', 'PNG'];

export default function ContentLibraryPage() {
    const [page, setPage] = useState(0);
    const [fileType, setFileType] = useState<string | null>(null);

    const { data, isLoading, isError } = useContentList(page, 10, fileType);
    const deleteContent = useDeleteContent();
    const downloadContent = useDownloadContent();

    const handleFilterChange = (e: SelectChangeEvent) => {
        setFileType(e.target.value || null);
        setPage(0);
    };

    return (
        <>
            <Navbar />
            <PageWrapper>
                <Box
                    sx={{ display: 'flex', gap: 2, justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap" }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>Content Library</Typography>
                        <Typography color="text.secondary">
                            {data?.totalElements ?? 0} files uploaded
                        </Typography>
                    </Box>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>File Type</InputLabel>
                        <Select value={fileType ?? ''} label="File Type" onChange={handleFilterChange}>
                            <MenuItem value="">All Types</MenuItem>
                            {FILE_TYPE_OPTIONS.filter(Boolean).map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {isLoading && (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }} >
                        <CircularProgress />
                    </Box>
                )}

                {isError && (
                    <Alert severity="error">Failed to load content. Please try again.</Alert>
                )}

                {!isLoading && data?.content?.length === 0 && (
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 6 }}>
                            <InsertDriveFileIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
                            <Typography color="text.secondary">No files found.</Typography>
                        </CardContent>
                    </Card>
                )}

                {data?.content?.map((item: ContentItem) => (
                    <Card key={item.id} sx={{ mb: 1.5 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
                            <InsertDriveFileIcon color="primary" sx={{ fontSize: 32 }} />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 600 }} noWrap>{item.title}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {item.originalFilename} · {item.fileSizeFormatted} · {new Date(item.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Chip label={item.fileType} size="small" sx={{ flexShrink: 0 }} />
                            <Tooltip title="View File">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<VisibilityIcon fontSize="small" />}
                                    href={item.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ flexShrink: 0, textTransform: 'none' }}
                                >
                                    View
                                </Button>
                            </Tooltip>
                            <Tooltip title="Download">
                                <IconButton
                                    size="small"
                                    onClick={() => downloadContent.mutate({ id: item.id, filename: item.originalFilename })}
                                >
                                    <DownloadIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => deleteContent.mutate(item.id)}
                                    disabled={deleteContent.isPending}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </CardContent>
                    </Card>
                ))}

                {(data?.totalPages ?? 0) > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }} >
                        <Pagination
                            count={data?.totalPages}
                            page={page + 1}
                            onChange={(_, value) => setPage(value - 1)}
                            color="primary"
                        />
                    </Box>
                )}
            </PageWrapper >
        </>
    );
}