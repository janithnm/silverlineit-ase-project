package com.silverlineit.coursecontentsystem.common.exception;

import org.springframework.http.HttpStatus;

public class FileSizeLimitExceededException extends AppException {
    public FileSizeLimitExceededException(long limitBytes) {
        super("File size exceeds the maximum allowed limit of " + (limitBytes / (1024 * 1024)) + "MB", HttpStatus.PAYLOAD_TOO_LARGE);
    }
}

