package com.silverlineit.coursecontentsystem.common.storage;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StorageResult {
    private String storedFilename;
    private String storagePath;
    private String fileUrl;
    private String provider;
}