CREATE INDEX idx_course_content_uploader_id ON course_content (uploader_id);
CREATE INDEX idx_course_content_file_type   ON course_content (file_type);
CREATE INDEX idx_course_content_created_at  ON course_content (created_at);
CREATE INDEX idx_course_content_is_deleted  ON course_content (is_deleted);
CREATE INDEX idx_refresh_tokens_user_id     ON refresh_tokens (user_id);
CREATE INDEX idx_users_email                ON users (email);