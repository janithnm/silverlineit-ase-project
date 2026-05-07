package com.silverlineit.coursecontentsystem.content.controller;

import com.silverlineit.coursecontentsystem.common.response.ApiResponse;
import com.silverlineit.coursecontentsystem.content.dto.ContentResponse;
import com.silverlineit.coursecontentsystem.content.dto.PagedResponse;
import com.silverlineit.coursecontentsystem.content.dto.UploadRequest;
import com.silverlineit.coursecontentsystem.content.entity.CourseContent;
import com.silverlineit.coursecontentsystem.content.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ContentResponse>> upload(
            @RequestPart("file") MultipartFile file,
            @RequestPart("data") @Valid UploadRequest request) {

        ContentResponse response = contentService.upload(file, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("File uploaded successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ContentResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String fileType) {

        PagedResponse<ContentResponse> response = contentService.getAll(page, size, fileType);
        return ResponseEntity.ok(ApiResponse.success("Content retrieved", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContentResponse>> getById(@PathVariable Long id) {
        ContentResponse response = contentService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Content retrieved", response));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        CourseContent content = contentService.getContentEntityById(id);
        byte[] fileBytes = contentService.download(id);

        String mediaType = resolveMediaType(content.getFileType().name());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + content.getOriginalFilename() + "\"")
                .contentType(MediaType.parseMediaType(mediaType))
                .contentLength(fileBytes.length)
                .body(fileBytes);
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<byte[]> serveFile(@PathVariable String filename) {
        // Serve file inline (for previews)
        String storagePath = contentService.resolvePathByFilename(filename);
        byte[] fileBytes = contentService.retrieveByPath(storagePath);
        String ext = filename.substring(filename.lastIndexOf('.') + 1).toUpperCase();
        String mediaType = resolveMediaType(ext);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(mediaType))
                .body(fileBytes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        contentService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Content deleted successfully"));
    }

    private String resolveMediaType(String fileType) {
        return switch (fileType.toUpperCase()) {
            case "PDF" -> "application/pdf";
            case "MP4" -> "video/mp4";
            case "JPG", "JPEG" -> "image/jpeg";
            case "PNG" -> "image/png";
            default -> "application/octet-stream";
        };
    }

    
}