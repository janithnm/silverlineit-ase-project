package com.silverlineit.coursecontentsystem.common.exception;

import org.springframework.http.HttpStatus;

public class EmailNotVerifiedException extends AppException {
    public EmailNotVerifiedException() {
        super("Please verify your email address before accessing this resource", HttpStatus.FORBIDDEN);
    }
}

