package com.silverlineit.coursecontentsystem.common.exception;

import org.springframework.http.HttpStatus;

public class FileTypeNotAllowedException extends AppException {
    public FileTypeNotAllowedException(String fileType) {
        super("File type '" + fileType + "' is not allowed. Accepted types: PDF, MP4, JPG, JPEG, PNG", HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }
}

