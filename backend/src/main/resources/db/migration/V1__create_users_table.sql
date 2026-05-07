CREATE TABLE users (
                       id            BIGINT          NOT NULL AUTO_INCREMENT,
                       username      VARCHAR(50)     NOT NULL,
                       email         VARCHAR(255)    NOT NULL,
                       password_hash VARCHAR(255)    NOT NULL,
                       role          ENUM('ROLE_INSTRUCTOR', 'ROLE_ADMIN') NOT NULL DEFAULT 'ROLE_INSTRUCTOR',
                       is_active     BOOLEAN         NOT NULL DEFAULT TRUE,
                       created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                       CONSTRAINT pk_users PRIMARY KEY (id),
                       CONSTRAINT uq_users_email UNIQUE (email),
                       CONSTRAINT uq_users_username UNIQUE (username)
);