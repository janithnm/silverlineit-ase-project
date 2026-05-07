package com.silverlineit.coursecontentsystem.common.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    StorageResult store(MultipartFile file);
    byte[] retrieve(String storagePath);
    void delete(String storagePath);
}