package com.silverlineit.coursecontentsystem.content.dto;

import com.silverlineit.coursecontentsystem.content.entity.CourseContent;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ContentResponse {
    private Long id;
    private String title;
    private String description;
    private String originalFilename;
    private String fileType;
    private Long fileSizeBytes;
    private String fileSizeFormatted;
    private String fileUrl;
    private String storageProvider;
    private UploaderInfo uploader;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Builder
    public static class UploaderInfo {
        private Long id;
        private String username;
    }

    public static ContentResponse from(CourseContent content) {
        return ContentResponse.builder()
                .id(content.getId())
                .title(content.getTitle())
                .description(content.getDescription())
                .originalFilename(content.getOriginalFilename())
                .fileType(content.getFileType().name())
                .fileSizeBytes(content.getFileSizeBytes())
                .fileSizeFormatted(formatFileSize(content.getFileSizeBytes()))
                .fileUrl(content.getFileUrl())
                .storageProvider(content.getStorageProvider().name())
                .uploader(UploaderInfo.builder()
                        .id(content.getUploader().getId())
                        .username(content.getUploader().getUsername())
                        .build())
                .createdAt(content.getCreatedAt())
                .updatedAt(content.getUpdatedAt())
                .build();
    }

    private static String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024.0);
        if (bytes < 1024 * 1024 * 1024) return String.format("%.1f MB", bytes / (1024.0 * 1024));
        return String.format("%.1f GB", bytes / (1024.0 * 1024 * 1024));
    }
}