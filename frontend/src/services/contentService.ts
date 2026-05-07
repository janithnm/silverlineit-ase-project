import { contentApi } from '../api/contentApi';
import type { ContentItem, PaginatedResponse } from '../types';

const ALLOWED_EXTENSIONS = ['pdf', 'mp4', 'jpg', 'jpeg', 'png'];
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export const contentService = {
    validateFile(file: File): string[] {
        const errors: string[] = [];
        const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            errors.push(`File type .${extension} is not allowed. Accepted: PDF, MP4, JPG, JPEG, PNG`);
        }
        if (file.size > MAX_FILE_SIZE) {
            errors.push(`File size ${this.formatSize(file.size)} exceeds the 100MB limit`);
        }
        return errors;
    },

    formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    },

    getFileIcon(fileType: string): 'pdf' | 'video' | 'image' | 'file' {
        const type = fileType?.toUpperCase();
        if (type === 'PDF') return 'pdf';
        if (type === 'MP4') return 'video';
        if (['JPG', 'JPEG', 'PNG'].includes(type)) return 'image';
        return 'file';
    },

    async upload(
        file: File,
        title: string,
        description: string,
        onProgress?: (percent: number) => void
    ): Promise<ContentItem> {
        const errors = this.validateFile(file);
        if (errors.length > 0) throw new Error(errors.join('\n'));

        const formData = new FormData();
        formData.append('file', file);
        formData.append(
            'data',
            new Blob([JSON.stringify({ title, description })], { type: 'application/json' })
        );

        const { data } = await contentApi.upload(formData, (progressEvent: ProgressEvent) => {
            if (progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress?.(percent);
            }
        });

        return data.data;
    },

    async getAll(
        page: number,
        size: number,
        fileType: string | null
    ): Promise<PaginatedResponse<ContentItem>> {
        const { data } = await contentApi.getAll(page, size, fileType);
        return data.data;
    },

    async getById(id: number): Promise<ContentItem> {
        const { data } = await contentApi.getById(id);
        return data.data;
    },

    async download(id: number, filename: string): Promise<void> {
        return contentApi.download(id, filename);
    },

    async delete(id: number): Promise<string> {
        const { data } = await contentApi.delete(id);
        return data.message;
    },
};