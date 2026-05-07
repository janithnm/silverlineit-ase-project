CREATE TABLE refresh_tokens (
                                id          BIGINT       NOT NULL AUTO_INCREMENT,
                                user_id     BIGINT       NOT NULL,
                                token       VARCHAR(512) NOT NULL,
                                expiry_date DATETIME     NOT NULL,
                                is_revoked  BOOLEAN      NOT NULL DEFAULT FALSE,
                                created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                CONSTRAINT pk_refresh_tokens PRIMARY KEY (id),
                                CONSTRAINT uq_refresh_tokens_token UNIQUE (token),
                                CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id)
                                    REFERENCES users (id) ON DELETE CASCADE
);