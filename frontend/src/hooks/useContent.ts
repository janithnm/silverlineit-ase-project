import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contentService } from '../services/contentService';

export const useContentList = (page: number, size: number, fileType: string | null) => {
    return useQuery({
        queryKey: ['content', page, size, fileType],
        queryFn: () => contentService.getAll(page, size, fileType),
        placeholderData: (prev) => prev,
    });
};

export const useContentById = (id: number | null) => {
    return useQuery({
        queryKey: ['content', id],
        queryFn: () => contentService.getById(id!),
        enabled: !!id,
    });
};

export const useUploadContent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            file,
            title,
            description,
            onProgress,
        }: {
            file: File;
            title: string;
            description: string;
            onProgress?: (percent: number) => void;
        }) => contentService.upload(file, title, description, onProgress),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content'] }),
    });
};

export const useDeleteContent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => contentService.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content'] }),
    });
};

export const useDownloadContent = () => {
    return useMutation({
        mutationFn: ({ id, filename }: { id: number; filename: string }) =>
            contentService.download(id, filename),
    });
};