package com.silverlineit.coursecontentsystem.common.storage;

import com.silverlineit.coursecontentsystem.common.config.AppProperties;
import com.silverlineit.coursecontentsystem.common.exception.StorageException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "local", matchIfMissing = true)
public class LocalStorageService implements StorageService {

    private final AppProperties appProperties;
    private Path uploadDir;

    @PostConstruct
    public void init() {
        uploadDir = Paths.get(appProperties.getStorage().getLocal().getUploadDir())
                .toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadDir);
            log.info("Local storage initialized at: {}", uploadDir);
        } catch (IOException e) {
            throw new StorageException("Could not create upload directory: " + e.getMessage());
        }
    }

    @Override
    public StorageResult store(MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = getExtension(originalFilename);
            String storedFilename = UUID.randomUUID() + "." + extension;
            Path targetPath = uploadDir.resolve(storedFilename);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("Stored file: {}", storedFilename);

            return StorageResult.builder()
                    .storedFilename(storedFilename)
                    .storagePath(targetPath.toString())
                    .fileUrl("/api/v1/content/files/" + storedFilename)
                    .provider("LOCAL")
                    .build();
        } catch (IOException e) {
            throw new StorageException("Failed to store file: " + e.getMessage());
        }
    }

    @Override
    public byte[] retrieve(String storagePath) {
        try {
            Path filePath = Paths.get(storagePath);
            if (!Files.exists(filePath)) {
                throw new StorageException("File not found at path: " + storagePath);
            }
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new StorageException("Failed to retrieve file: " + e.getMessage());
        }
    }

    @Override
    public void delete(String storagePath) {
        try {
            Path filePath = Paths.get(storagePath);
            Files.deleteIfExists(filePath);
            log.info("Deleted file at: {}", storagePath);
        } catch (IOException e) {
            throw new StorageException("Failed to delete file: " + e.getMessage());
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}