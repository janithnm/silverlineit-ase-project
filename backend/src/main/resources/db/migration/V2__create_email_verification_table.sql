ALTER TABLE users
    ADD COLUMN is_email_verified      BOOLEAN      NOT NULL DEFAULT FALSE,
    ADD COLUMN verification_token     VARCHAR(255)          DEFAULT NULL,
    ADD COLUMN verification_token_expiry DATETIME           DEFAULT NULL;