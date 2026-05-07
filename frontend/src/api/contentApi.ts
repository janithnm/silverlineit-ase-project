import type { ApiResponse, ContentItem, PaginatedResponse } from '../types';
import type { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';

export const contentApi = {
    upload: (
        formData: FormData,
        onUploadProgress?: (event: ProgressEvent) => void
    ): Promise<AxiosResponse<ApiResponse<ContentItem>>> =>
        axiosInstance.post('/content/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress,
        }),

    getAll: (
        page = 0,
        size = 10,
        fileType: string | null = null
    ): Promise<AxiosResponse<ApiResponse<PaginatedResponse<ContentItem>>>> => {
        const params: Record<string, unknown> = { page, size };
        if (fileType) params.fileType = fileType;
        return axiosInstance.get('/content', { params });
    },

    getById: (id: number): Promise<AxiosResponse<ApiResponse<ContentItem>>> =>
        axiosInstance.get(`/content/${id}`),

    download: (id: number, filename: string): Promise<void> =>
        axiosInstance
            .get(`/content/${id}/download`, { responseType: 'blob' })
            .then((response) => {
                // Extract filename from Content-Disposition header
                const disposition = response.headers['content-disposition'] as string | undefined;
                let resolvedFilename = filename;
                if (disposition) {
                    const match = disposition.match(/filename="?([^"\n]+)"?/);
                    if (match?.[1]) resolvedFilename = match[1];
                }
                const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', resolvedFilename || 'download');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            }),

    delete: (id: number): Promise<AxiosResponse<ApiResponse<null>>> =>
        axiosInstance.delete(`/content/${id}`),
};