import {
    Box, Card, CardContent, TextField, Button,
    Typography, LinearProgress, Alert
} from '@mui/material';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import { useUploadContent } from '../hooks/useContent';
import { contentService } from '../services/contentService';

export default function UploadPage() {
    const upload = useUploadContent();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [progress, setProgress] = useState(0);
    const [fileError, setFileError] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selected = acceptedFiles[0];
        if (!selected) return;
        const errors = contentService.validateFile(selected);
        if (errors.length > 0) {
            setFileError(errors.join('\n'));
            setFile(null);
        } else {
            setFileError('');
            setFile(selected);
            if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, ''));
        }
    }, [title]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'application/pdf': ['.pdf'],
            'video/mp4': ['.mp4'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setProgress(0);
        upload.mutate(
            { file, title, description, onProgress: setProgress },
            {
                onSuccess: () => {
                    setFile(null);
                    setTitle('');
                    setDescription('');
                    setProgress(0);
                },
            }
        );
    };

    return (
        <>
            <Navbar />
            <PageWrapper maxWidth="sm">
                <Typography variant="h4" sx={{ fontWeight: 700 }} mb={1}>Upload Content</Typography>
                <Typography color="text.secondary" mb={3}>
                    Upload course materials — PDF, MP4, JPG, or PNG up to 100MB.
                </Typography>

                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2.5}>

                            {/* Dropzone */}
                            <Box
                                {...getRootProps()}
                                sx={{
                                    border: '2px dashed',
                                    borderColor: isDragActive ? 'primary.main' : 'divider',
                                    borderRadius: 2,
                                    p: 4,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    bgcolor: isDragActive ? 'primary.light' : 'background.default',
                                    transition: 'all 0.2s',
                                    '&:hover': { borderColor: 'primary.main' },
                                }}
                            >
                                <input {...getInputProps()} />
                                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                                {file ? (
                                    <Box>
                                        <Typography sx={{ fontWeight: 600 }}>{file.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {contentService.formatSize(file.size)}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            {isDragActive ? 'Drop it here' : 'Drag & drop or click to select'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            PDF, MP4, JPG, PNG · Max 100MB
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {fileError && <Alert severity="error">{fileError}</Alert>}

                            <TextField
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Description (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                            />

                            {upload.isPending && (
                                <Box>
                                    <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 1 }} />
                                    <Typography variant="caption" color="text.secondary">{progress}%</Typography>
                                </Box>
                            )}

                            {upload.isError && (
                                <Alert severity="error">
                                    {(upload.error as Error)?.message || 'Upload failed.'}
                                </Alert>
                            )}

                            {upload.isSuccess && (
                                <Alert severity="success">File uploaded successfully!</Alert>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={!file || upload.isPending}
                                fullWidth
                            >
                                {upload.isPending ? `Uploading... ${progress}%` : 'Upload File'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </PageWrapper>
        </>
    );
}