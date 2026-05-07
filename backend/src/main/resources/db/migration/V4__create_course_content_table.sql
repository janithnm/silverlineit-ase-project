CREATE TABLE course_content (
                                id                BIGINT       NOT NULL AUTO_INCREMENT,
                                uploader_id       BIGINT       NOT NULL,
                                title             VARCHAR(255) NOT NULL,
                                description       TEXT                  DEFAULT NULL,
                                original_filename VARCHAR(255) NOT NULL,
                                stored_filename   VARCHAR(255) NOT NULL,
                                file_type         ENUM('PDF', 'MP4', 'JPG', 'JPEG', 'PNG') NOT NULL,
                                file_size_bytes   BIGINT       NOT NULL,
                                storage_provider  ENUM('LOCAL', 'S3')   NOT NULL DEFAULT 'LOCAL',
                                storage_path      TEXT         NOT NULL,
                                file_url          TEXT         NOT NULL,
                                is_deleted        BOOLEAN      NOT NULL DEFAULT FALSE,
                                created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                CONSTRAINT pk_course_content PRIMARY KEY (id),
                                CONSTRAINT fk_course_content_uploader FOREIGN KEY (uploader_id)
                                    REFERENCES users (id) ON DELETE RESTRICT
);