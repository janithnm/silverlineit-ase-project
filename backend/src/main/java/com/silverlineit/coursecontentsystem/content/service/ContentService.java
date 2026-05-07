package com.silverlineit.coursecontentsystem.content.service;

import com.silverlineit.coursecontentsystem.auth.entity.User;
import com.silverlineit.coursecontentsystem.auth.repository.UserRepository;
import com.silverlineit.coursecontentsystem.common.config.AppProperties;
import com.silverlineit.coursecontentsystem.common.exception.FileTypeNotAllowedException;
import com.silverlineit.coursecontentsystem.common.exception.FileSizeLimitExceededException;
import com.silverlineit.coursecontentsystem.common.exception.ResourceNotFoundException;
import com.silverlineit.coursecontentsystem.common.exception.UnauthorizedAccessException;
import com.silverlineit.coursecontentsystem.common.storage.StorageResult;
import com.silverlineit.coursecontentsystem.common.storage.StorageService;
import com.silverlineit.coursecontentsystem.content.dto.ContentResponse;
import com.silverlineit.coursecontentsystem.content.dto.PagedResponse;
import com.silverlineit.coursecontentsystem.content.dto.UploadRequest;
import com.silverlineit.coursecontentsystem.content.entity.CourseContent;
import com.silverlineit.coursecontentsystem.content.repository.CourseContentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContentService {

    private final CourseContentRepository contentRepository;
    private final StorageService storageService;
    private final UserRepository userRepository;
    private final AppProperties appProperties;

    @Transactional
    public ContentResponse upload(MultipartFile file, UploadRequest request) {
        // Validate file not empty
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        // Validate file size
        long maxSize = appProperties.getUpload().getMaxFileSizeBytes();
        if (file.getSize() > maxSize) {
            throw new FileSizeLimitExceededException(maxSize);
        }

        // Validate file type
        String extension = getExtension(file.getOriginalFilename());
        CourseContent.FileType fileType = resolveFileType(extension);

        // Store file
        StorageResult result = storageService.store(file);

        // Get current user
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User uploader = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Save metadata
        CourseContent content = CourseContent.builder()
                .uploader(uploader)
                .title(request.getTitle())
                .description(request.getDescription())
                .originalFilename(file.getOriginalFilename())
                .storedFilename(result.getStoredFilename())
                .fileType(fileType)
                .fileSizeBytes(file.getSize())
                .storageProvider(CourseContent.StorageProvider.valueOf(result.getProvider()))
                .storagePath(result.getStoragePath())
                .fileUrl(result.getFileUrl())
                .build();

        CourseContent saved = contentRepository.save(content);
        log.info("Content uploaded: {} by {}", saved.getId(), email);

        return ContentResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public String resolvePathByFilename(String filename) {
        return contentRepository.findAll().stream()
                .filter(c -> !c.isDeleted() && c.getStoredFilename().equals(filename))
                .findFirst()
                .map(CourseContent::getStoragePath)
                .orElseThrow(() -> new ResourceNotFoundException("File not found: " + filename));
    }

    public byte[] retrieveByPath(String storagePath) {
        return storageService.retrieve(storagePath);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ContentResponse> getAll(int page, int size, String fileType) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        // Resolve current authenticated user
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Long uploaderId = currentUser.getId();

        Page<CourseContent> result;

        if (fileType != null && !fileType.isBlank()) {
            CourseContent.FileType type = resolveFileType(fileType);
            result = contentRepository.findByUploaderIdAndDeletedFalseAndFileType(uploaderId, type, pageable);
        } else {
            result = contentRepository.findByUploaderIdAndDeletedFalse(uploaderId, pageable);
        }

        return buildPagedResponse(result);
    }

    @Transactional(readOnly = true)
    public ContentResponse getById(Long id) {
        CourseContent content = contentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Content not found with id: " + id));
        return ContentResponse.from(content);
    }

    @Transactional(readOnly = true)
    public byte[] download(Long id) {
        CourseContent content = contentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Content not found with id: " + id));
        return storageService.retrieve(content.getStoragePath());
    }

    @Transactional(readOnly = true)
    public CourseContent getContentEntityById(Long id) {
        return contentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Content not found with id: " + id));
    }

    @Transactional
    public void delete(Long id) {
        CourseContent content = contentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Content not found with id: " + id));

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Only owner or admin can delete
        boolean isOwner = content.getUploader().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == User.Role.ROLE_ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedAccessException(
                    "You do not have permission to delete this content");
        }

        content.setDeleted(true);
        contentRepository.save(content);
        log.info("Content soft deleted: {} by {}", id, email);
    }

    private CourseContent.FileType resolveFileType(String extension) {
        List<String> allowed = Arrays.asList(
                appProperties.getUpload().getAllowedTypes().split(","));

        if (!allowed.contains(extension.toLowerCase())) {
            throw new FileTypeNotAllowedException(extension);
        }

        return CourseContent.FileType.valueOf(extension.toUpperCase());
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            throw new FileTypeNotAllowedException("unknown");
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    private PagedResponse<ContentResponse> buildPagedResponse(Page<CourseContent> page) {
        List<ContentResponse> content = page.getContent()
                .stream()
                .map(ContentResponse::from)
                .toList();

        return PagedResponse.<ContentResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}