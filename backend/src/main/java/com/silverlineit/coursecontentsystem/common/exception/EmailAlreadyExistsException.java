package com.silverlineit.coursecontentsystem.common.exception;

import org.springframework.http.HttpStatus;

public class EmailAlreadyExistsException extends AppException {
    public EmailAlreadyExistsException(String email) {
        super("An account with email '" + email + "' already exists", HttpStatus.CONFLICT);
    }
}

