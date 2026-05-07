export interface User {
    id: number;
    username: string;
    email: string;
    emailVerified: boolean;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface ContentItem {
    id: number;
    title: string;
    description?: string;
    originalFilename: string;
    fileType: string;
    fileSizeBytes: number;
    fileSizeFormatted: string;
    fileUrl: string;
    createdAt: string;
    uploader: { id: number; username: string };
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}